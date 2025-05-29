import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';
import { userService } from '../services/api';
import AIRoadmap from '../components/AIRoadmap';

const Profile = () => {
  const { userProfile, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    educationLevel: '',
    interests: [],
    skills: '',
    careerGoals: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, [fetchUserProfile]);
  
  // Initialize form data when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFormData({
        educationLevel: userProfile.educationLevel || '',
        interests: userProfile.interests || [],
        skills: userProfile.skills || '',
        careerGoals: userProfile.careerGoals || ''
      });
    }
  }, [userProfile]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleInterestsChange = (e) => {
    const value = e.target.value;
    const interestsArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({
      ...prev,
      interests: interestsArray
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await userService.updateOnboardingData(formData);
      await fetchUserProfile(); // Refresh profile data
      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile information');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };
  
  const clearField = (field) => {
    if (field === 'interests') {
      setFormData(prev => ({ ...prev, interests: [] }));
    } else {
      setFormData(prev => ({ ...prev, [field]: '' }));
    }
  };


  return (
    <div className="min-h-screen bg-dark-500 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-dark-400 rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">My Profile</h1>
          
          {successMessage && (
            <div className="bg-green-500 bg-opacity-10 border border-green-500 text-green-500 p-4 rounded-md mb-4">
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {userProfile?.firstName ? userProfile.firstName.charAt(0).toUpperCase() : '?'}
              {userProfile?.lastName ? userProfile.lastName.charAt(0).toUpperCase() : ''}
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {userProfile?.firstName || userProfile?.lastName ? 
                  `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() : 
                  'User'}
              </h2>
            </div>
          </div>

          <div className="p-4 bg-dark-300 rounded-md border border-dark-200 mb-6">
            <h3 className="text-lg font-semibold mb-4">User Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">First Name:</p>
                <p className="text-md font-medium">{userProfile?.firstName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Last Name:</p>
                <p className="text-md font-medium">{userProfile?.lastName || 'Not set'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-400 mb-1">Email:</p>
                <p className="text-md font-medium">{userProfile?.email || 'Not set'}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-dark-300 rounded-md border border-dark-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Onboarding Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-primary-500 hover:bg-primary-600 text-white py-1 px-3 rounded-md text-sm transition-all duration-200"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Education Level</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleInputChange}
                      className="w-full bg-dark-500 text-white rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <button 
                      type="button" 
                      onClick={() => clearField('educationLevel')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-r-md"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Interests (comma separated)</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="interests"
                      value={formData.interests.join(', ')}
                      onChange={handleInterestsChange}
                      className="w-full bg-dark-500 text-white rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <button 
                      type="button" 
                      onClick={() => clearField('interests')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-r-md"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Skills</label>
                  <div className="flex">
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleInputChange}
                      className="w-full bg-dark-500 text-white rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    <button 
                      type="button" 
                      onClick={() => clearField('skills')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-r-md"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Career Goals</label>
                  <div className="flex">
                    <textarea
                      name="careerGoals"
                      value={formData.careerGoals}
                      onChange={handleInputChange}
                      className="w-full bg-dark-500 text-white rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      rows="3"
                    ></textarea>
                    <button 
                      type="button" 
                      onClick={() => clearField('careerGoals')}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-r-md self-stretch flex items-center"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-md transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Education Level</h4>
                  <p className="text-md font-medium">{userProfile?.educationLevel || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Interests</h4>
                  {userProfile?.interests && userProfile.interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {userProfile.interests.map((interest, index) => (
                        <span key={index} className="bg-primary-500 bg-opacity-20 text-primary-300 px-2 py-1 rounded-md text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-md font-medium">No interests specified</p>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Skills</h4>
                  <p className="text-md font-medium">{userProfile?.skills || 'Not specified'}</p>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Career Goals</h4>
                  <p className="text-md font-medium">{userProfile?.careerGoals || 'Not specified'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* AI Roadmap Section */}
      <div className="max-w-3xl mx-auto mt-8">
        <AIRoadmap userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Profile;
