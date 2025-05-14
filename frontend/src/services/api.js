import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Updated to match the running frontend server port

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
