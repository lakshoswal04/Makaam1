import axios from 'axios';

// Set the production API URL for the deployed backend
const PRODUCTION_API_URL = 'https://makaam11.onrender.com';

// Function to get the current API URL
const getApiUrl = () => {
  // Check if we're in production mode
  if (process.env.NODE_ENV === 'production') {
    console.log('Using production API URL:', PRODUCTION_API_URL);
    return `${PRODUCTION_API_URL}/api`;
  }
  // In development, use the Vite proxy
  console.log('Using Vite proxy for API requests');
  return '/api';
};

// Create axios instance with dynamic base URL
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable sending cookies and auth headers
});

// Update baseURL before each request
api.interceptors.request.use(config => {
  config.baseURL = getApiUrl();
  return config;
});

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle connection errors and try different ports
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Only retry for network errors or 5xx server errors
    const isNetworkError = !error.response;
    const isServerError = error.response && error.response.status >= 500;
    
    if ((isNetworkError || isServerError) && error.config && !error.config._retry) {
      error.config._retry = true;
      
      // Try the next port
      currentPortIndex = (currentPortIndex + 1) % BACKEND_PORTS.length;
      console.log(`Trying next backend port: ${BACKEND_PORTS[currentPortIndex]}`);
      
      // Update the baseURL for the retry
      error.config.baseURL = getApiUrl();
      
      // Retry the request
      return api(error.config);
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (credentials) => {
    try {
      console.log('Login request with:', credentials);
      const response = await api.post('/auth', credentials);
      console.log('Login response:', response.data);
      if (response.data) {
        localStorage.setItem('token', response.data);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      console.log('Register request with:', userData);
      const response = await api.post('/users', userData);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: () => {
    return localStorage.getItem('token');
  }
};

// User services
export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/me');
      console.log('Profile data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error.response?.data?.message || error.message);
      throw error;
    }
  },
  
  updateOnboardingData: async (onboardingData) => {
    try {
      console.log('Sending onboarding data update:', {
        educationLevel: onboardingData.educationLevel,
        interestsCount: onboardingData.interests?.length,
        hasSkills: !!onboardingData.skills,
        hasCareerGoals: !!onboardingData.careerGoals
      });
      
      const response = await api.put('/users/profile', onboardingData);
      console.log('Onboarding data updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update onboarding data error:', error.response?.data?.message || error.message);
      throw error;
    }
  },
  
  updateProfile: async (userData) => {
    try {
      // Log the request data (hiding sensitive information)
      if (userData.currentPassword && userData.newPassword) {
        console.log('Sending password update request');
      } else {
        console.log('Sending profile update request with data:', { 
          firstName: userData.firstName, 
          lastName: userData.lastName
        });
      }
      
      // Make the API request with detailed logging
      console.log('Making API request to /users/me');
      const response = await api.put('/users/me', userData);
      
      // Log success and return the data
      if (response && response.data) {
        console.log('API request successful:', response.status);
        return response.data;
      } else {
        console.error('Invalid response from server');
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      // Log the error details for debugging
      console.error('Update profile error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
      throw error;
    }
  },
  
  generateRoadmap: async (profileData, useCache = false) => {
    try {
      if (useCache) {
        console.log('Attempting to use cached roadmap');
        try {
          // Try to get the cached roadmap first
          const cachedResponse = await api.get('/roadmap');
          console.log('Using cached roadmap');
          return cachedResponse.data;
        } catch (cacheError) {
          // If no cached roadmap exists, continue to generate a new one
          console.log('No cached roadmap found, generating new one');
        }
      }
      
      console.log('Generating AI roadmap with profile data');
      // Log the profile data being sent (without sensitive information)
      console.log('Profile data:', {
        educationLevel: profileData.educationLevel,
        interestsCount: profileData.interests?.length,
        hasSkills: !!profileData.skills,
        hasCareerGoals: !!profileData.careerGoals
      });
      
      // Add useCache query parameter if needed
      const response = await api.post(`/roadmap/generate${useCache ? '?useCache=true' : ''}`, profileData);
      console.log('Roadmap generated successfully');
      return response.data;
    } catch (error) {
      console.error('Generate roadmap error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
      throw error;
    }
  },
  
  getRoadmap: async () => {
    try {
      console.log('Fetching stored roadmap');
      const response = await api.get('/roadmap');
      console.log('Roadmap fetched successfully');
      return response.data;
    } catch (error) {
      console.error('Get roadmap error:', error);
      console.error('Error details:', {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        data: error.response?.data
      });
      throw error;
    }
  }
};

export default api;
