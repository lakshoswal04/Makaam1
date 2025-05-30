const axios = require("axios");
const fs = require('fs');
const path = require('path');
const { GROQ_API_KEY } = require("../config/keys");
const { User } = require("../models/user");

// Groq API configuration
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Using hardcoded API key from config
console.log('Using Groq API key from config');

/**
 * Generate a personalized career roadmap using Groq
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateRoadmap = async (req, res) => {
  // Check if user already has a roadmap and wants to use cached version
  const useCache = req.query.useCache === 'true';
  try {
    console.log('Roadmap generation request received:', req.body);
    console.log('User ID from token:', req.user._id);
    
    // Get user profile data from request or database
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      console.log('User not found with ID:', userId);
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
    
    console.log('User found:', {
      name: `${user.firstName} ${user.lastName}`,
      hasEducationLevel: !!user.educationLevel,
      interestsCount: user.interests?.length || 0,
      hasSkills: !!user.skills,
      hasCareerGoals: !!user.careerGoals,
      hasRoadmap: !!user.roadmap
    });
    
    // If user has a roadmap and useCache is true, return the cached roadmap
    if (useCache && user.roadmap) {
      console.log('Using cached roadmap from user document');
      return res.status(200).json({
        success: true,
        roadmap: user.roadmap,
        cached: true
      });
    }

    // Combine request data with user data from database
    const profileData = {
      firstName: user.firstName || 'User',
      lastName: user.lastName || '',
      educationLevel: user.educationLevel || req.body.educationLevel || 'Not specified',
      interests: user.interests || req.body.interests || [],
      skills: user.skills || req.body.skills || 'Not specified',
      careerGoals: user.careerGoals || req.body.careerGoals || 'Not specified'
    };
    
    console.log('Combined profile data:', profileData);

    // Check if we have enough profile data
    const missingFields = [];
    if (!profileData.educationLevel || profileData.educationLevel === 'Not specified') missingFields.push("education level");
    if (!profileData.interests || profileData.interests.length === 0) missingFields.push("interests");
    if (!profileData.skills || profileData.skills === 'Not specified') missingFields.push("skills");
    if (!profileData.careerGoals || profileData.careerGoals === 'Not specified') missingFields.push("career goals");

    if (missingFields.length > 0) {
      console.log('Missing profile fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Please complete your profile with the following information: ${missingFields.join(", ")}`
      });
    }

    // Create prompt for Groq
    const prompt = createRoadmapPrompt(profileData);
    console.log('Created Groq prompt');

    // Call Groq API using hardcoded key from config
    console.log('Using Groq API key from config');
    
    let roadmap;
    console.log('Calling Groq API...');
    try {
      const groqResponse = await axios.post(
        GROQ_API_URL,
        {
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are a career development expert who creates personalized learning and career roadmaps."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          }
        }
      );
      
      console.log('Groq API response received');
      
      // Parse the response
      const roadmapText = groqResponse.data.choices[0].message.content;
      console.log('Roadmap text received:', roadmapText.substring(0, 100) + '...');
      roadmap = parseRoadmapResponse(roadmapText);
      
      // Save the roadmap to the user document
      user.roadmap = {
        ...roadmap,
        createdAt: new Date()
      };
      
      await user.save();
      console.log('Roadmap saved to user document');
      
      // Return the roadmap
      return res.status(200).json({
        success: true,
        roadmap
      });
    } catch (groqError) {
      console.error('Groq API error:', groqError.message);
      console.error('Groq error details:', groqError.response?.data || 'No response data');
      
      // Create a mock roadmap for testing if Groq fails
      console.log('Creating mock roadmap for testing');
      roadmap = createMockRoadmap(profileData);
      
      // Save the mock roadmap to the user document
      user.roadmap = {
        ...roadmap,
        createdAt: new Date()
      };
      
      await user.save();
      console.log('Mock roadmap saved to user document');
      
      // Return the mock roadmap
      return res.status(200).json({
        success: true,
        roadmap,
        note: "Using mock data due to Groq API issues"
      });
    }
  } catch (error) {
    console.error("Error generating roadmap:", error);
    
    // Handle Groq API specific errors
    if (error.response && error.response.data) {
      console.error("Groq API error:", error.response.data);
      
      if (error.response.status === 429) {
        return res.status(429).json({
          success: false,
          message: "Too many requests to the AI service. Please try again later."
        });
      }
    }
    
    return res.status(500).json({
      success: false,
      message: "Failed to generate roadmap. Please try again later."
    });
  }
};

/**
 * Create a prompt for the Groq API based on user profile data
 * @param {Object} profileData - User profile data
 * @returns {String} - Formatted prompt
 */
const createRoadmapPrompt = (profileData) => {
  return `
Create a personalized career and learning roadmap for a person with the following profile:

- Name: ${profileData.firstName} ${profileData.lastName}
- Education Level: ${profileData.educationLevel}
- Interests: ${profileData.interests.join(", ")}
- Skills: ${profileData.skills}
- Career Goals: ${profileData.careerGoals}

The roadmap should be structured in 4 phases:
1. LEARN - What they need to study and understand
2. PRACTICE - How they should practice and develop skills
3. BUILD - Projects they should create to demonstrate skills
4. APPLY - How to apply skills in real-world settings

For each phase, include:
- A clear title
- A brief description
- 3-5 specific topics to cover
- Recommended tools or technologies
- 2-3 suggested projects or exercises
- 1-3 helpful resources (books, courses, websites) with links when possible

RESPONSE INSTRUCTIONS:
- ONLY return a valid, minified JSON object (no markdown, no comments, no extra text, no trailing commas, no code block, no explanation).
- Do NOT include any text before or after the JSON.
- The JSON must have these exact keys: learn, practice, build, apply.
- Each phase must have: title, description, topics, tools, projects, resources.
- All arrays must be valid JSON arrays.

EXAMPLE FORMAT:
{"learn":{"title":"Phase 1: Learn","description":"...","topics":["...","..."],"tools":["..."],"projects":["..."],"resources":[{"title":"...","url":"..."}]},"practice":{...},"build":{...},"apply":{...}}
`;
};

/**
 * Parse the Groq response into a structured roadmap object
 * @param {String} responseText - Raw text response from Groq
 * @returns {Object} - Structured roadmap object
 */
const parseRoadmapResponse = (responseText) => {
  try {
    console.log('Attempting to parse roadmap response...');
    
    // Clean up the response text to handle common issues
    let cleanedText = responseText;
    
    // Try to extract just the JSON part if there's markdown or other text
    const jsonBlockMatch = responseText.match(/```(?:json)?([\s\S]*?)```/);
    if (jsonBlockMatch && jsonBlockMatch[1]) {
      cleanedText = jsonBlockMatch[1].trim();
      console.log('Extracted JSON from code block');
    }
    
    // Try to find JSON object pattern
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
      console.log('Extracted JSON object pattern');
    }
    
    // Replace any trailing commas before closing brackets (common JSON error)
    cleanedText = cleanedText.replace(/,\s*([\}\]])(?=\s*$|\s*[,\}\]])/g, '$1');
    
    // Try to parse the JSON
    let roadmap;
    try {
      roadmap = JSON.parse(cleanedText);
      console.log('Successfully parsed JSON');
    } catch (parseError) {
      console.error('Initial JSON parse failed:', parseError.message);
      
      // If parsing fails, try a more aggressive approach to fix common JSON issues
      console.log('Attempting more aggressive JSON repair...');
      
      // Remove all newlines and extra whitespace
      cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
      
      // Try to manually extract each phase section
      const manualRoadmap = {};
      const phases = ['learn', 'practice', 'build', 'apply'];
      
      for (const phase of phases) {
        // Create a default structure for this phase
        manualRoadmap[phase] = {
          title: `Phase: ${phase.charAt(0).toUpperCase() + phase.slice(1)}`,
          description: "Extracted from partial data.",
          topics: [],
          tools: [],
          projects: [],
          resources: []
        };
        
        // Try to extract title
        const titleMatch = new RegExp(`"${phase}"\s*:\s*{[^}]*"title"\s*:\s*"([^"]+)"`, 'i').exec(cleanedText);
        if (titleMatch && titleMatch[1]) {
          manualRoadmap[phase].title = titleMatch[1];
        }
        
        // Try to extract description
        const descMatch = new RegExp(`"${phase}"\s*:\s*{[^}]*"description"\s*:\s*"([^"]+)"`, 'i').exec(cleanedText);
        if (descMatch && descMatch[1]) {
          manualRoadmap[phase].description = descMatch[1];
        }
      }
      
      roadmap = manualRoadmap;
      console.log('Created manual roadmap structure from partial data');
    }
    
    // Validate and ensure the structure is complete
    const requiredPhases = ['learn', 'practice', 'build', 'apply'];
    const requiredFields = ['title', 'description', 'topics', 'tools', 'projects', 'resources'];
    
    for (const phase of requiredPhases) {
      if (!roadmap[phase]) {
        roadmap[phase] = {
          title: `Phase: ${phase.charAt(0).toUpperCase() + phase.slice(1)}`,
          description: "No information provided for this phase.",
          topics: [],
          tools: [],
          projects: [],
          resources: []
        };
      } else {
        // Ensure all required fields exist
        for (const field of requiredFields) {
          if (!roadmap[phase][field]) {
            roadmap[phase][field] = field === 'description' ? 
              "No information provided." : 
              [];
          }
          
          // Ensure arrays are actually arrays
          if (field !== 'title' && field !== 'description' && !Array.isArray(roadmap[phase][field])) {
            roadmap[phase][field] = [];
          }
        }
      }
    }
    
    console.log('Roadmap structure validation complete');
    return roadmap;
  } catch (error) {
    console.error("Error parsing roadmap response:", error);
    
    // Return a default structure if parsing fails
    return {
      learn: {
        title: "Phase 1: Learn",
        description: "We couldn't generate a personalized roadmap. Please try again later.",
        topics: [],
        tools: [],
        projects: [],
        resources: []
      },
      practice: {
        title: "Phase 2: Practice",
        description: "We couldn't generate a personalized roadmap. Please try again later.",
        topics: [],
        tools: [],
        projects: [],
        resources: []
      },
      build: {
        title: "Phase 3: Build",
        description: "We couldn't generate a personalized roadmap. Please try again later.",
        topics: [],
        tools: [],
        projects: [],
        resources: []
      },
      apply: {
        title: "Phase 4: Apply",
        description: "We couldn't generate a personalized roadmap. Please try again later.",
        topics: [],
        tools: [],
        projects: [],
        resources: []
      }
    };
  }
};

/**
 * Create a mock roadmap for testing when OpenAI API fails
 * @param {Object} profileData - User profile data
 * @returns {Object} - Mock roadmap object
 */
const createMockRoadmap = (profileData) => {
  const interests = profileData.interests || [];
  const firstInterest = interests.length > 0 ? interests[0] : 'technology';
  
  return {
    learn: {
      title: "Phase 1: Learn",
      description: `Build a strong foundation in ${firstInterest} and related technologies.`,
      topics: [
        "Core concepts and principles",
        "Industry best practices",
        "Fundamental skills development"
      ],
      tools: [
        "Online courses",
        "Documentation",
        "Tutorial videos"
      ],
      projects: [
        "Complete beginner tutorials",
        "Build simple practice projects"
      ],
      resources: [
        {title: "Coursera", url: "https://www.coursera.org"},
        {title: "Udemy", url: "https://www.udemy.com"},
        {title: "YouTube Tutorials", url: "https://www.youtube.com"}
      ]
    },
    practice: {
      title: "Phase 2: Practice",
      description: "Apply your knowledge through hands-on practice and experimentation.",
      topics: [
        "Problem-solving techniques",
        "Practical application",
        "Skill refinement"
      ],
      tools: [
        "Practice platforms",
        "Coding challenges",
        "Peer review"
      ],
      projects: [
        "Solve real-world problems",
        "Participate in challenges"
      ],
      resources: [
        {title: "LeetCode", url: "https://leetcode.com"},
        {title: "HackerRank", url: "https://www.hackerrank.com"},
        {title: "GitHub", url: "https://github.com"}
      ]
    },
    build: {
      title: "Phase 3: Build",
      description: "Create substantial projects that demonstrate your capabilities.",
      topics: [
        "Project planning",
        "Implementation strategies",
        "Quality assurance"
      ],
      tools: [
        "Project management tools",
        "Version control",
        "Testing frameworks"
      ],
      projects: [
        "Portfolio website",
        "Full-stack application"
      ],
      resources: [
        {title: "GitHub Pages", url: "https://pages.github.com"},
        {title: "Netlify", url: "https://www.netlify.com"},
        {title: "Vercel", url: "https://vercel.com"}
      ]
    },
    apply: {
      title: "Phase 4: Apply",
      description: "Put your skills to work in real-world settings and continue growing.",
      topics: [
        "Job search strategies",
        "Interview preparation",
        "Networking"
      ],
      tools: [
        "LinkedIn",
        "Job boards",
        "Resume builders"
      ],
      projects: [
        "Contribute to open source",
        "Freelance projects"
      ],
      resources: [
        {title: "LinkedIn", url: "https://www.linkedin.com"},
        {title: "Indeed", url: "https://www.indeed.com"},
        {title: "Glassdoor", url: "https://www.glassdoor.com"}
      ]
    }
  };
};

module.exports = {
  generateRoadmap
};
