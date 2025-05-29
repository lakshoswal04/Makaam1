import axios from 'axios';

const testRoadmapGeneration = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/roadmap/generate', {
      educationLevel: 'college_student',
      interests: ['web_development', 'design'],
      skills: ['html_css', 'javascript'],
      goals: 'I want to become a frontend developer with strong UI/UX skills',
      userId: 'test123'
    });
    
    console.log('API Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error testing API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
};

testRoadmapGeneration();
