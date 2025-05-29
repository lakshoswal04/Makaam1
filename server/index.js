require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { OpenAI } = require('openai');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Groq API configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'your-groq-api-key';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// We'll use Groq for all AI operations (roadmap generation and weekly check-ins)

// Routes
app.get('/', (req, res) => {
  res.send('PathFinder API is running');
});

// Generate career roadmap
app.post('/api/roadmap/generate', async (req, res) => {
  try {
    const { educationLevel, interests, skills, goals, userId } = req.body;
    
    if (!educationLevel || !interests || !goals || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const prompt = `
      Create a detailed learning roadmap for a user with the following profile:
        
      Education Level: ${educationLevel}
      Interests: ${interests.join(', ')}
      Current Skills: ${skills?.join(', ') || 'Beginner (no specific skills yet)'}
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
      console.log('AI Response received, length:', responseContent.length);
      
      // Extract JSON from the response
      let jsonStr = '';
      
      // Try different patterns to extract JSON
      if (responseContent.includes('```json')) {
        // Extract JSON from markdown code blocks
        const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonStr = jsonMatch[1].trim();
          console.log('Extracted JSON from code block');
        }
      } else if (responseContent.includes('{') && responseContent.includes('}')) {
        // Extract JSON directly
        const startIdx = responseContent.indexOf('{');
        const endIdx = responseContent.lastIndexOf('}') + 1;
        if (startIdx >= 0 && endIdx > startIdx) {
          jsonStr = responseContent.substring(startIdx, endIdx);
          console.log('Extracted JSON directly from response');
        }
      }
      
      // If we couldn't extract JSON, use the whole response
      if (!jsonStr) {
        console.log('Could not extract JSON, using fallback roadmap');
        
        // Use a fallback roadmap instead of failing
        roadmapData = {
          title: `${interests[0].charAt(0).toUpperCase() + interests[0].slice(1)} Development Roadmap`,
          description: `A personalized learning path for ${educationLevel.replace('_', ' ')} focusing on ${interests.join(', ')}.`,
          progress: 0,
          phases: [
            {
              id: 1,
              name: 'Learn',
              description: 'Build your foundational knowledge',
              complete: false,
              inProgress: true,
              topics: [
                {
                  name: 'Fundamentals',
                  description: 'Master the core concepts',
                  complete: skills.includes('html_css') || skills.includes('javascript'),
                  inProgress: !skills.includes('html_css') && !skills.includes('javascript'),
                  resources: [
                    {
                      type: 'Course',
                      name: 'Web Development Basics',
                      url: 'https://www.freecodecamp.org/learn',
                      source: 'FreeCodeCamp'
                    }
                  ]
                }
              ]
            },
            {
              id: 2,
              name: 'Practice',
              description: 'Apply your skills to real problems',
              complete: false,
              inProgress: false,
              topics: [
                {
                  name: 'Projects',
                  description: 'Build small projects to practice',
                  complete: false,
                  inProgress: false,
                  resources: [
                    {
                      type: 'Tutorial',
                      name: 'Practical Projects',
                      url: 'https://www.theodinproject.com',
                      source: 'The Odin Project'
                    }
                  ]
                }
              ]
            },
            {
              id: 3,
              name: 'Build',
              description: 'Create comprehensive projects',
              complete: false,
              inProgress: false,
              topics: [
                {
                  name: 'Portfolio Projects',
                  description: 'Build projects for your portfolio',
                  complete: false,
                  inProgress: false,
                  resources: [
                    {
                      type: 'Guide',
                      name: 'Portfolio Building',
                      url: 'https://github.com/practical-tutorials/project-based-learning',
                      source: 'GitHub'
                    }
                  ]
                }
              ]
            },
            {
              id: 4,
              name: 'Apply',
              description: 'Prepare for job opportunities',
              complete: false,
              inProgress: false,
              topics: [
                {
                  name: 'Job Preparation',
                  description: 'Get ready for the job market',
                  complete: false,
                  inProgress: false,
                  resources: [
                    {
                      type: 'Guide',
                      name: 'Tech Interview Handbook',
                      url: 'https://techinterviewhandbook.org',
                      source: 'Tech Interview Handbook'
                    }
                  ]
                }
              ]
            }
          ],
          estimatedTimeToComplete: '6 months',
          difficulty: 'Intermediate',
          prerequisites: []
        };
        
        return;
      }
      
      console.log('Attempting to parse JSON...');
      
      try {
        // Parse the JSON
        roadmapData = JSON.parse(jsonStr);
        console.log('JSON parsed successfully');
      } catch (parseError) {
        console.error('JSON parse error:', parseError.message);
        throw parseError;
      }
      
      // Add user ID to the roadmap data
      roadmapData.userId = userId;
      
      // Store in Firebase
      try {
        const { collection, doc, setDoc, getDoc, updateDoc } = require('firebase/firestore');
        const { db } = require('./firebaseConfig');
        
        console.log('Storing roadmap in Firestore...');
        const roadmapRef = doc(collection(db, 'roadmaps'));
        await setDoc(roadmapRef, {
          ...roadmapData,
          createdAt: new Date(),
          updatedAt: new Date(),
          enrolledUsers: [userId]
        });
        console.log('Roadmap stored with ID:', roadmapRef.id);
        
        // Update the user document with the roadmap ID
        console.log('Updating user document with roadmap ID...');
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await updateDoc(userRef, {
            assignedRoadmapId: roadmapRef.id,
            updatedAt: new Date()
          });
          console.log('User document updated successfully');
        } else {
          console.log('User document not found, skipping update');
        }
      } catch (firebaseError) {
        console.error('Firebase operation error:', firebaseError);
        // Continue with the response even if Firebase operations fail
      }
      
      res.json({ 
        success: true, 
        roadmapId: roadmapRef ? roadmapRef.id : `fallback-${Date.now()}`,
        roadmap: roadmapData 
      });
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Create a fallback roadmap when parsing fails
      roadmapData = {
        title: `${interests[0].charAt(0).toUpperCase() + interests[0].slice(1)} Development Roadmap`,
        description: `A personalized learning path for ${educationLevel.replace('_', ' ')} focusing on ${interests.join(', ')}.`,
        progress: 0,
        phases: [
          {
            id: 1,
            name: 'Learn',
            description: 'Build your foundational knowledge',
            complete: false,
            inProgress: true,
            topics: [
              {
                name: 'Fundamentals',
                description: 'Master the core concepts',
                complete: skills && (skills.includes('html_css') || skills.includes('javascript')),
                inProgress: skills && !skills.includes('html_css') && !skills.includes('javascript'),
                resources: [
                  {
                    type: 'Course',
                    name: 'Web Development Basics',
                    url: 'https://www.freecodecamp.org/learn',
                    source: 'FreeCodeCamp'
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            name: 'Practice',
            description: 'Apply your skills to real problems',
            complete: false,
            inProgress: false,
            topics: [
              {
                name: 'Projects',
                description: 'Build small projects to practice',
                complete: false,
                inProgress: false,
                resources: [
                  {
                    type: 'Tutorial',
                    name: 'Practical Projects',
                    url: 'https://www.theodinproject.com',
                    source: 'The Odin Project'
                  }
                ]
              }
            ]
          },
          {
            id: 3,
            name: 'Build',
            description: 'Create comprehensive projects',
            complete: false,
            inProgress: false,
            topics: [
              {
                name: 'Portfolio Projects',
                description: 'Build projects for your portfolio',
                complete: false,
                inProgress: false,
                resources: [
                  {
                    type: 'Guide',
                    name: 'Portfolio Building',
                    url: 'https://github.com/practical-tutorials/project-based-learning',
                    source: 'GitHub'
                  }
                ]
              }
            ]
          },
          {
            id: 4,
            name: 'Apply',
            description: 'Prepare for job opportunities',
            complete: false,
            inProgress: false,
            topics: [
              {
                name: 'Job Preparation',
                description: 'Get ready for the job market',
                complete: false,
                inProgress: false,
                resources: [
                  {
                    type: 'Guide',
                    name: 'Tech Interview Handbook',
                    url: 'https://techinterviewhandbook.org',
                    source: 'Tech Interview Handbook'
                  }
                ]
              }
            ]
          }
        ],
        estimatedTimeToComplete: '6 months',
        difficulty: 'Intermediate',
        prerequisites: []
      };
      
      // Continue with the process using the fallback roadmap
      console.log('Using fallback roadmap due to parsing error');
      
      // Add user ID to the roadmap data
      roadmapData.userId = userId;
      
      // Store the fallback roadmap in Firebase
      try {
        const { collection, doc, setDoc, getDoc, updateDoc } = require('firebase/firestore');
        const { db } = require('./firebaseConfig');
        
        console.log('Storing fallback roadmap in Firestore...');
        const fallbackRoadmapRef = doc(collection(db, 'roadmaps'));
        await setDoc(fallbackRoadmapRef, {
          ...roadmapData,
          createdAt: new Date(),
          updatedAt: new Date(),
          enrolledUsers: [userId],
          isFallback: true
        });
        console.log('Fallback roadmap stored with ID:', fallbackRoadmapRef.id);
        
        // Update the user document with the roadmap ID
        console.log('Updating user document with fallback roadmap ID...');
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await updateDoc(userRef, {
            assignedRoadmapId: fallbackRoadmapRef.id,
            updatedAt: new Date()
          });
          console.log('User document updated with fallback roadmap');
        } else {
          console.log('User document not found, skipping update');
        }
        
        // Return the response with the fallback roadmap
        return res.json({
          success: true,
          roadmapId: fallbackRoadmapRef.id,
          roadmap: roadmapData,
          isFallback: true
        });
      } catch (fallbackFirebaseError) {
        console.error('Firebase operation error with fallback:', fallbackFirebaseError);
        // Continue with a simple response if Firebase operations fail
        return res.json({
          success: true,
          roadmapId: `fallback-${Date.now()}`,
          roadmap: roadmapData,
          isFallback: true
        });
      }
    }
    
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

// Weekly check-in
app.post('/api/checkin', async (req, res) => {
  try {
    const { progress, challenges, goals, questions, userId } = req.body;
    
    if (!progress || !goals || !userId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Get the user's roadmap to provide context for the check-in
    let roadmapData = null;
    let streak = 0;
    
    try {
      const { collection, doc, getDoc, updateDoc, Timestamp } = require('firebase/firestore');
      const { db } = require('./firebaseConfig');
      
      // Get user data to find their assigned roadmap
      try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Get the user's streak data
          streak = userData.streak || 0;
          
          // Increment streak if this is a new day
          const lastCheckIn = userData.lastCheckIn ? userData.lastCheckIn.toDate() : null;
          const today = new Date();
          
          if (!lastCheckIn || 
              lastCheckIn.getDate() !== today.getDate() || 
              lastCheckIn.getMonth() !== today.getMonth() || 
              lastCheckIn.getFullYear() !== today.getFullYear()) {
            streak += 1;
            
            try {
              // Update user's streak in Firestore
              await updateDoc(userRef, {
                streak: streak,
                lastCheckIn: Timestamp.now()
              });
              console.log(`Updated streak for user ${userId} to ${streak}`);
            } catch (updateError) {
              console.error('Error updating user streak:', updateError);
              // Continue with the current streak value but don't update Firestore
            }
          }
          
          // Get the user's roadmap if available
          if (userData.assignedRoadmapId) {
            try {
              const roadmapRef = doc(db, 'roadmaps', userData.assignedRoadmapId);
              const roadmapDoc = await getDoc(roadmapRef);
              
              if (roadmapDoc.exists()) {
                roadmapData = roadmapDoc.data();
              }
            } catch (roadmapError) {
              console.error('Error fetching roadmap:', roadmapError);
              // Continue without roadmap data
            }
          }
        } else {
          console.log(`User document not found for ID: ${userId}`);
        }
      } catch (userError) {
        console.error('Error fetching user document:', userError);
      }
    } catch (firebaseError) {
      console.error('Error initializing Firebase for check-in:', firebaseError);
      // Continue with check-in even if we couldn't get the roadmap
    }
    
    // Create a prompt that includes roadmap context if available
    let roadmapContext = '';
    if (roadmapData) {
      roadmapContext = `
      The user is following a "${roadmapData.title}" roadmap.
      Current progress: ${roadmapData.progress || 0}%
      Current learning phase: ${roadmapData.phases.find(p => p.inProgress)?.name || 'Learning'}
      `;
    }
    
    const prompt = `
      You are an AI career coach conducting a weekly check-in with a student. Based on the following information:
      
      - Progress this week: ${progress}
      - Challenges faced: ${challenges || 'None specified'}
      - Goals for next week: ${goals}
      - Questions: ${questions || 'None specified'}
      - Current streak: ${streak} days${roadmapContext}
      
      Provide a helpful response that:
      1. Acknowledges their progress and current streak
      2. Offers advice on their challenges
      3. Refines their goals if needed
      4. Answers their questions
      5. Suggests 2-3 specific next steps based on their roadmap
      
      Keep your response encouraging, practical, and focused on helping them move forward in their learning journey.
    `;
    
    // Call Groq API for the weekly check-in
    const completion = await axios.post(
      GROQ_API_URL,
      {
        messages: [
          {
            role: "system",
            content: "You are an expert career coach specializing in technology education. Your task is to provide personalized feedback and guidance for weekly check-ins."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "llama3-70b-8192",
        temperature: 0.7,
        max_tokens: 2048,
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const response = completion.data.choices[0].message.content;
    
    res.json({ 
      response,
      streak: streak
    });
    
  } catch (error) {
    console.error('Error processing check-in:', error);
    res.status(500).json({ error: 'Failed to process check-in' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});