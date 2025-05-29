import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    educationLevel: '',
    interests: [],
    skills: '',
    careerGoals: ''
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setProfile(data);
        
        // Initialize form data with current profile values
        if (data && data.data) {
          setFormData({
            educationLevel: data.data.educationLevel || '',
            interests: data.data.interests || [],
            skills: data.data.skills || '',
            careerGoals: data.data.careerGoals || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);
  
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
      const response = await userService.updateOnboardingData(formData);
      setProfile(response);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-dark-400 rounded-lg shadow-lg p-6">
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
      
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
          {profile?.data?.firstName?.charAt(0)}{profile?.data?.lastName?.charAt(0)}
        </div>
        
        <h2 className="text-xl font-bold text-white">
          {profile?.data?.firstName} {profile?.data?.lastName}
        </h2>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Onboarding Information</h3>
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
          <div className="space-y-4 bg-dark-500 p-4 rounded-md">
            <div>
              <h4 className="text-gray-300 text-sm">Education Level</h4>
              <p className="text-white">{profile?.data?.educationLevel || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="text-gray-300 text-sm">Interests</h4>
              {profile?.data?.interests && profile.data.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.data.interests.map((interest, index) => (
                    <span key={index} className="bg-primary-500 bg-opacity-20 text-primary-300 px-2 py-1 rounded-md text-sm">
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-white">No interests specified</p>
              )}
            </div>
            
            <div>
              <h4 className="text-gray-300 text-sm">Skills</h4>
              <p className="text-white">{profile?.data?.skills || 'Not specified'}</p>
            </div>
            
            <div>
              <h4 className="text-gray-300 text-sm">Career Goals</h4>
              <p className="text-white">{profile?.data?.careerGoals || 'Not specified'}</p>
            </div>
          </div>
        )}
      </div>
      
      <button
        onClick={logout}
        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all duration-200"
      >
        Sign Out
      </button>
    </div>
  );
};

export default UserProfile;
