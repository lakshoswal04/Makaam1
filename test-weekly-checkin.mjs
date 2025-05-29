import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// Test data
const testData = {
  progress: "I completed the first two modules of the React course and built a small project using hooks.",
  challenges: "I struggled with understanding the Context API and how to properly manage global state.",
  goals: "I want to master Redux and implement it in my project next week.",
  questions: "What's the best way to structure a large React application with multiple state sources?",
  userId: "test-user-123" // Replace with a valid user ID from your Firestore database
};

async function testWeeklyCheckin() {
  try {
    console.log('Testing weekly check-in with Groq API...');
    console.log('Sending data:', testData);
    
    const response = await axios.post('http://localhost:5000/api/checkin', testData);
    
    console.log('\nResponse from server:');
    console.log('Status:', response.status);
    console.log('Streak:', response.data.streak);
    console.log('\nAI Response:');
    console.log(response.data.response);
    
    return true;
  } catch (error) {
    console.error('Error testing weekly check-in:', error.response?.data || error.message);
    return false;
  }
}

// Run the test
testWeeklyCheckin().then(success => {
  if (success) {
    console.log('\nTest completed successfully!');
  } else {
    console.log('\nTest failed.');
  }
});
