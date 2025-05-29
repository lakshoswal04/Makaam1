import axios from 'axios';
import { roadmapService } from './roadmap.service.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Check if API key is available
if (!GROQ_API_KEY) {
  console.warn('Warning: GROQ_API_KEY is not set in environment variables');
}

export const aiService = {
  /**
   * Generate a personalized roadmap based on user onboarding data
   * @param {Object} userData - User data from onboarding
   * @param {string} userId - Firebase user ID
   * @returns {Promise<string>} - ID of the created roadmap
   */
  async generateRoadmap(userData, userId) {
    try {
      // Extract relevant data from user profile
      const { educationLevel, interests, skills, goals } = userData;
      
      // Create a prompt for the AI
      const prompt = `
        Create a detailed learning roadmap for a user with the following profile:
        
        Education Level: ${educationLevel}
        Interests: ${interests.join(', ')}
        Current Skills: ${skills.join(', ') || 'Beginner (no specific skills yet)'}
        Career Goals: ${goals}
        
        The roadmap should include:
        1. A title and brief description
        2. 4 phases (Learn, Practice, Build, Apply)
        3. Each phase should have 3-4 topics with:
           - Name
           - Description
           - Complete status (false for all except for skills they already have)
           - 2-3 resources (with type, name, source, and URL)
        4. Overall progress percentage (based on completed topics)
        5. Estimated time to complete
        6. Difficulty level
        7. Prerequisites
        
        Format the response as a JSON object with the following structure:
        {
          "title": "string",
          "description": "string",
          "progress": number,
          "phases": [
            {
              "id": number,
              "name": "string",
              "description": "string",
              "complete": boolean,
              "inProgress": boolean,
              "topics": [
                {
                  "name": "string",
                  "description": "string",
                  "complete": boolean,
                  "inProgress": boolean,
                  "resources": [
                    {
                      "type": "string",
                      "name": "string",
                      "url": "string",
                      "source": "string"
                    }
                  ]
                }
              ]
            }
          ],
          "estimatedTimeToComplete": "string",
          "difficulty": "string",
          "prerequisites": ["string"]
        }
        
        Make sure all URLs are real, working links to actual resources. For any skills the user already has, mark those topics as complete=true.
      `;
      
      // Call Groq API directly using axios
      const completion = await axios.post(
        GROQ_API_URL,
        {
          messages: [
            {
              role: "system",
              content: "You are an expert curriculum designer and career coach specializing in technology education. Your task is to create personalized learning roadmaps."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          model: "llama3-70b-8192",
          temperature: 0.5,
          max_tokens: 4096,
        },
        {
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Parse the response
      const responseContent = completion.data.choices[0].message.content;
      let roadmapData;
      
      try {
        // Extract JSON from the response
        const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                          responseContent.match(/{[\s\S]*}/);
                          
        const jsonStr = jsonMatch ? 
          (jsonMatch[1] ? jsonMatch[1] : jsonMatch[0]) : 
          responseContent;
          
        roadmapData = JSON.parse(jsonStr);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to parse AI-generated roadmap');
      }
      
      // Add user ID to the roadmap data
      roadmapData.userId = userId;
      
      // Create the roadmap in the database
      const roadmapId = await roadmapService.createRoadmap(roadmapData);
      
      return roadmapId;
    } catch (error) {
      console.error('Error generating roadmap with AI:', error);
      throw error;
    }
  }
};
