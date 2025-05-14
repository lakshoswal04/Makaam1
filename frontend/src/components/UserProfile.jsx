import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/api';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await userService.getProfile();
        setProfile(data);
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
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-4">
          {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
        </div>
        
        <h2 className="text-xl font-bold text-white">
          {profile?.firstName} {profile?.lastName}
        </h2>
        <p className="text-gray-400 mb-6">{profile?.email}</p>
        
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-all duration-200"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
