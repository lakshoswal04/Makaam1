import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminProfile = () => {
  const { userProfile, logout } = useAuth();

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-dark-500 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Admin Profile</h1>
          <div className="bg-dark-400 rounded-lg p-6 animate-pulse">
            <p>Loading profile information...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-500 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Profile</h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
          >
            Logout
          </button>
        </div>

        <div className="bg-dark-400 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-400 text-sm">Full Name</p>
                  <p className="text-lg">{userProfile.firstName} {userProfile.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-lg">{userProfile.email}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Role</p>
                  <p className="text-lg flex items-center">
                    <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full mr-2">Admin</span>
                    Administrator
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-purple-400">Account Information</h2>
              <div className="space-y-3">
                {userProfile.educationLevel && (
                  <div>
                    <p className="text-gray-400 text-sm">Education Level</p>
                    <p className="text-lg">{userProfile.educationLevel}</p>
                  </div>
                )}
                {userProfile.skills && (
                  <div>
                    <p className="text-gray-400 text-sm">Skills</p>
                    <p className="text-lg">{userProfile.skills}</p>
                  </div>
                )}
                {userProfile.interests && userProfile.interests.length > 0 && (
                  <div>
                    <p className="text-gray-400 text-sm">Interests</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {userProfile.interests.map((interest, index) => (
                        <span key={index} className="bg-dark-300 px-3 py-1 rounded-full text-sm">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-400 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-400">Admin Privileges</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Manage all resources in the resource library</li>
            <li>Add new resources to the platform</li>
            <li>Edit existing resource information</li>
            <li>Delete resources from the platform</li>
            <li>Access to admin dashboard and analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
