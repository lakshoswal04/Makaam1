import axios from 'axios';
import api from './api';

const API_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'x-auth-token': token } : {};
};

// Get all resources
export const getAllResources = async () => {
  try {
    const response = await axios.get(`${API_URL}/resources`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

// Get resources by domain
export const getResourcesByDomain = async (domain) => {
  try {
    const response = await axios.get(`${API_URL}/resources/domain/${domain}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching resources for domain ${domain}:`, error);
    throw error;
  }
};

// Get resources by type
export const getResourcesByType = async (type) => {
  try {
    const response = await axios.get(`${API_URL}/resources/type/${type}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching resources for type ${type}:`, error);
    throw error;
  }
};

// Get free or premium resources
export const getResourcesByPremiumStatus = async (isPremium) => {
  try {
    const response = await axios.get(`${API_URL}/resources/premium/${isPremium}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${isPremium ? 'premium' : 'free'} resources:`, error);
    throw error;
  }
};

// Create a new resource (admin only)
export const createResource = async (resourceData) => {
  try {
    const response = await axios.post(`${API_URL}/resources`, resourceData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error('Error creating resource:', error);
    if (error.response && error.response.status === 403) {
      throw new Error('Access denied. Only administrators can create resources.');
    }
    throw error;
  }
};

// Update a resource (admin only)
export const updateResource = async (id, resourceData) => {
  try {
    const response = await axios.put(`${API_URL}/resources/${id}`, resourceData, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating resource with id ${id}:`, error);
    if (error.response && error.response.status === 403) {
      throw new Error('Access denied. Only administrators can update resources.');
    }
    throw error;
  }
};

// Delete a resource (admin only)
export const deleteResource = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/resources/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting resource with id ${id}:`, error);
    if (error.response && error.response.status === 403) {
      throw new Error('Access denied. Only administrators can delete resources.');
    }
    throw error;
  }
};
