import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUsers, FaBook, FaPlus, FaEdit, FaTrash, FaChevronRight, FaUserShield, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ResourceForm from '../components/ResourceForm';
import { getAllResources, deleteResource } from '../services/resourceService';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const { isAdmin, isAuthenticated, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('resources');
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  // Redirect non-admin users
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, isAuthenticated, navigate]);

  // Fetch resources
  useEffect(() => {
    if (activeTab === 'resources') {
      fetchResources();
    }
  }, [activeTab]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await getAllResources();
      setResources(response.data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResource = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
        setResources(resources.filter(resource => resource._id !== id));
      } catch (err) {
        console.error('Error deleting resource:', err);
        setError('Failed to delete resource. Please try again.');
      }
    }
  };

  const handleAddSuccess = () => {
    setShowAddForm(false);
    setEditingResource(null);
    fetchResources();
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaUserShield className="text-purple-400" /> Admin Dashboard
            </h1>
            <div className="flex items-center space-x-2">
              {userProfile && (
                <span className="text-gray-300 mr-2">Welcome, {userProfile.firstName}!</span>
              )}
              <button
                onClick={logout}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-red-600/20"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 mb-6 md:mb-0">
              <h2 className="text-lg font-semibold text-white mb-4">Management</h2>
              <ul className="space-y-1">
                <li>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-medium ${activeTab === 'dashboard' ? 'bg-purple-600/20 text-purple-400' : 'hover:bg-white/10 text-gray-300'}`}
                  >
                    <FaTachometerAlt className="mr-2" />
                    <span>Dashboard</span>
                    <FaChevronRight className="ml-auto" size={12} />
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('resources')}
                    className={`flex items-center w-full text-left px-3 py-2 rounded-lg transition-all duration-200 font-medium ${activeTab === 'resources' ? 'bg-purple-600/20 text-purple-400' : 'hover:bg-white/10 text-gray-300'}`}
                  >
                    <FaBook className="mr-2" />
                    <span>Resources</span>
                    <FaChevronRight className="ml-auto" size={12} />
                  </button>
                </li>
              </ul>
              
              <hr className="my-4 border-white/10" />
            </div>
            
            {/* Main Content */}
            <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              {activeTab === 'dashboard' && (
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2"><FaTachometerAlt className="text-purple-400" /> Admin Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-purple-600/10 border border-purple-600/20 p-6 rounded-2xl shadow-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="text-purple-400 text-sm font-medium">Total Resources</p>
                        <p className="text-2xl font-bold text-white mt-1">{resources.length}</p>
                      </div>
                      <div className="bg-purple-600/20 p-3 rounded-full">
                        <FaBook className="text-purple-400" size={24} />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      className="bg-blue-600/10 border border-blue-600/20 p-6 rounded-2xl shadow-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="text-blue-400 text-sm font-medium">Premium Resources</p>
                        <p className="text-2xl font-bold text-white mt-1">{resources.filter(r => r.isPremium).length}</p>
                      </div>
                      <div className="bg-blue-600/20 p-3 rounded-full">
                        <FaBook className="text-blue-400" size={24} />
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="bg-green-600/10 border border-green-600/20 p-6 rounded-2xl shadow-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="text-green-400 text-sm font-medium">Free Resources</p>
                        <p className="text-2xl font-bold text-white mt-1">{resources.filter(r => !r.isPremium).length}</p>
                      </div>
                      <div className="bg-green-600/20 p-3 rounded-full">
                        <FaBook className="text-green-400" size={24} />
                      </div>
                    </motion.div>
                  </div>
                </div>
              )}
              
              {activeTab === 'resources' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Manage Resources</h2>
                    <button
                      onClick={() => {
                        setEditingResource(null);
                        setShowAddForm(!showAddForm);
                      }}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      {showAddForm ? 'Cancel' : <><FaPlus className="mr-2" /> Add Resource</>}
                    </button>
                  </div>
                  
                  {showAddForm && (
                    <div className="mb-6">
                      <ResourceForm 
                        onSuccess={handleAddSuccess} 
                        initialData={editingResource}
                        isEditing={!!editingResource}
                      />
                    </div>
                  )}
                  
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : resources.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No resources found. Add your first resource!
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Premium</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {resources.map((resource) => (
                            <tr key={resource._id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{resource.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{resource.domain}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">{resource.type}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${resource.isPremium ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                  {resource.isPremium ? 'Premium' : 'Free'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button 
                                  onClick={() => handleEditResource(resource)}
                                  className="text-blue-600 hover:text-blue-900 mr-3"
                                >
                                  <FaEdit />
                                </button>
                                <button 
                                  onClick={() => handleDeleteResource(resource._id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
