import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUsers, FaBook, FaPlus, FaEdit, FaTrash, FaChevronRight, FaUserShield, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import ResourceForm from '../components/ResourceForm';
import { getAllResources, deleteResource } from '../services/resourceService';

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
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center space-x-2">
          {userProfile && (
            <span className="text-gray-600 mr-2">Welcome, {userProfile.firstName}!</span>
          )}
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300 flex items-center"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Management</h2>
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center w-full text-left px-3 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <FaTachometerAlt className="mr-2" />
                <span>Dashboard</span>
                <FaChevronRight className="ml-auto" size={12} />
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('resources')}
                className={`flex items-center w-full text-left px-3 py-2 rounded-md ${activeTab === 'resources' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <FaBook className="mr-2" />
                <span>Resources</span>
                <FaChevronRight className="ml-auto" size={12} />
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex items-center w-full text-left px-3 py-2 rounded-md ${activeTab === 'users' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
              >
                <FaUsers className="mr-2" />
                <span>Users</span>
                <FaChevronRight className="ml-auto" size={12} />
              </button>
            </li>
          </ul>
          
          <hr className="my-4 border-gray-200" />
          
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/admin/profile"
                className="flex items-center w-full text-left px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <FaUserShield className="mr-2" />
                <span>Admin Profile</span>
                <FaChevronRight className="ml-auto" size={12} />
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Admin Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 text-sm font-medium">Total Resources</p>
                      <p className="text-2xl font-bold mt-1">{resources.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaBook className="text-blue-600" size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 text-sm font-medium">Premium Resources</p>
                      <p className="text-2xl font-bold mt-1">
                        {resources.filter(r => r.isPremium).length}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <FaBook className="text-purple-600" size={24} />
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 text-sm font-medium">Free Resources</p>
                      <p className="text-2xl font-bold mt-1">
                        {resources.filter(r => !r.isPremium).length}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaBook className="text-green-600" size={24} />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setActiveTab('resources');
                      setEditingResource(null);
                      setShowAddForm(true);
                    }}
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <FaPlus className="text-blue-600" />
                      </div>
                      <span>Add New Resource</span>
                    </div>
                    <FaChevronRight size={12} className="text-gray-400" />
                  </button>
                  
                  <Link
                    to="/admin/profile"
                    className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-500 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="bg-purple-100 p-2 rounded-full mr-3">
                        <FaUserShield className="text-purple-600" />
                      </div>
                      <span>View Admin Profile</span>
                    </div>
                    <FaChevronRight size={12} className="text-gray-400" />
                  </Link>
                </div>
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
          
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Manage Users</h2>
              <p className="text-gray-500">User management functionality will be implemented soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
