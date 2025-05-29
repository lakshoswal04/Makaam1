import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import AIRoadmap from '../components/AIRoadmap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Dashboard = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen bg-dark-500 pt-20 pb-10">
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-white">Welcome back, {userProfile?.firstName || userProfile?.lastName ? `${userProfile?.firstName || ''}` : 'User'}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="bg-dark-400 rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-2 text-purple-400">Current Roadmap</h2>
              <AIRoadmap userProfile={userProfile} />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {/* Streak */}
            <div className="bg-dark-400 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Your Streak</h3>
              <div className="flex gap-2 mb-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border-2 border-purple-600" />
                ))}
              </div>
              <p className="text-gray-400 text-sm">Keep learning daily to maintain your streak and build momentum!</p>
            </div>
            {/* Weekly Check-in */}
            <div className="bg-dark-400 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Weekly Check-in</h3>
              <p className="text-gray-400 text-sm mb-3">Review your progress and get personalized feedback for the week ahead.</p>
              <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all duration-200 w-full">Start Check-in</button>
            </div>
            {/* Achievements */}
            <div className="bg-dark-400 rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Achievements</h3>
              <div className="flex flex-col gap-2">
                <div className="bg-dark-300 rounded-md p-3 text-gray-200">First Steps: Completed your profile and onboarding</div>
                {/* Add more achievements as needed */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 