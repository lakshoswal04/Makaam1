import axios from 'axios';

// Define multiple potential backend URLs to try
const BACKEND_PORTS = [5000, 5001, 5002, 5003];
let currentPortIndex = 0;

// Function to get the current API URL
const getApiUrl = () => `http://localhost:${BACKEND_PORTS[currentPortIndex]}/api`;

// Create axios instance with dynamic base URL
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
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
      if (response.data.data) {
        localStorage.setItem('token', response.data.data);
      }
      return response.data;
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
  }
};

export default api;
