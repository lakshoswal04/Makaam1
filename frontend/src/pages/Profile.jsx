import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser } from 'react-icons/fa';

const Profile = () => {
  const { userProfile, fetchUserProfile } = useAuth();

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


  return (
    <div className="min-h-screen bg-dark-500 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-dark-400 rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">My Profile</h1>
          
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

          <div className="p-4 bg-dark-300 rounded-md border border-dark-200">
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
        </div>
      </div>
    </div>
  );
};

export default Profile;
