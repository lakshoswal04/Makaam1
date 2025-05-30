import React, { useState, useEffect } from 'react';
import { FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ResourceGrid from '../components/ResourceGrid';
import ResourceFilter from '../components/ResourceFilter';
import { getAllResources, getResourcesByDomain, getResourcesByType, getResourcesByPremiumStatus } from '../services/resourceService';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaSearch, FaFilter, FaVideo, FaLink } from 'react-icons/fa';

const ResourceLibrary = () => {
  const { isAdmin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    domain: null,
    type: null,
    isPremium: null
  });

  // Resource types for filtering
  const resourceTypes = [
    'Course',
    'Blog',
    'GitHub Repository',
    'Video',
    'Book',
    'Tool',
    'Other'
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
  const fetchResources = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      let data;
      
      // Apply filters
      if (filters.domain) {
        data = await getResourcesByDomain(filters.domain);
      } else if (filters.type) {
        data = await getResourcesByType(filters.type);
      } else if (filters.isPremium !== null) {
        data = await getResourcesByPremiumStatus(filters.isPremium);
      } else {
        data = await getAllResources();
      }
      
      setResources(data.data || []);
        setFilteredResources(data.data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again later.');
      setResources([]);
        setFilteredResources([]);
    } finally {
      setIsLoading(false);
    }
  };

    if (isAuthenticated) fetchResources();
  }, [isAuthenticated, filters]);

  useEffect(() => {
    let filtered = resources;
    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredResources(filtered);
  }, [searchQuery, resources]);

  const handleTypeFilter = (type) => {
    setFilters((prev) => ({ ...prev, type: type === 'all' ? null : type }));
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">Resource Library</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleTypeFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  !filters.type
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              {resourceTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilter(type)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    filters.type === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 group"
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={resource.image || 'https://placehold.co/600x400/252945/FFFFFF/png?text=Resource'}
                  alt={resource.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white">
                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-200">
                  {resource.title}
                </h3>
                <p className="text-gray-400 mb-4 line-clamp-2">{resource.description}</p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200"
                >
                  View Resource
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        {filteredResources.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg">No resources found matching your criteria.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ResourceLibrary;
