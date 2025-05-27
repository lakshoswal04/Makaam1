require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key',
});

// Routes
app.get('/', (req, res) => {
  res.send('PathFinder API is running');
});

// Generate career roadmap
app.post('/api/roadmap/generate', async (req, res) => {
  try {
    const { educationLevel, interests, skills, goals } = req.body;
    
    if (!educationLevel || !interests || !goals) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const prompt = `
      Create a detailed career roadmap for a student with the following profile:
      - Education Level: ${educationLevel}
      - Interests: ${interests.join(', ')}
      - Current Skills: ${skills?.join(', ') || 'Beginner level'}
      - Career Goals: ${goals}

      The roadmap should be structured in the following phases:
      1. Learn - Foundational knowledge and skills
      2. Practice - Applying knowledge through exercises and small projects
      3. Build - Creating substantial projects that demonstrate skills
      4. Apply - Preparing for job opportunities and professional networking

      For each phase, provide:
      - A brief description
      - 3-5 specific topics or skills to focus on
      - Recommended resources (courses, books, tutorials)
      - Estimated time to complete the phase
      - Key milestones or projects to build

      Include relevant advice on learning pathways, potential challenges, and how to measure progress.
    `;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const roadmapText = completion.choices[0].message.content;
    
    // In a real app, you would parse this response and format it into a structured roadmap
    // For the demo, we'll return the raw text
    res.json({ roadmap: roadmapText });
    
  } catch (error) {
    console.error('Error generating roadmap:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

// Weekly check-in
app.post('/api/checkin', async (req, res) => {
  try {
    const { progress, challenges, goals, questions } = req.body;
    
    if (!progress || !goals) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const prompt = `
      You are an AI career coach conducting a weekly check-in with a student. Based on the following information:
      
      - Progress this week: ${progress}
      - Challenges faced: ${challenges || 'None specified'}
      - Goals for next week: ${goals}
      - Questions: ${questions || 'None specified'}
      
      Provide a helpful response that:
      1. Acknowledges their progress
      2. Offers advice on their challenges
      3. Refines their goals if needed
      4. Answers their questions
      5. Suggests 2-3 specific next steps
      
      Keep your response encouraging, practical, and focused on helping them move forward in their learning journey.
    `;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    const response = completion.choices[0].message.content;
    
    res.json({ response });
    
  } catch (error) {
    console.error('Error processing check-in:', error);
    res.status(500).json({ error: 'Failed to process check-in' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});