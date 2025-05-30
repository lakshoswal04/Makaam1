import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import AIRoadmap from '../components/AIRoadmap';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const res = await axios.get('/api/checkins', {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        const checkins = res.data.checkins || [];
        // Calculate streak based on consecutive days with completed items
        let currentStreak = 0;
        const today = new Date().toDateString();
        for (let i = 0; i < checkins.length; i++) {
          const checkinDate = new Date(checkins[i].date).toDateString();
          if (checkinDate === today) {
            currentStreak++;
          } else {
            break;
          }
        }
        setStreak(currentStreak);
      } catch (err) {
        console.error('Failed to fetch streak:', err);
      }
    };
    if (isAuthenticated) fetchStreak();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchAchievements = async () => {
      // Simulate fetching achievements based on user activity
      const userAchievements = [];
      if (userProfile && userProfile.onboardingCompleted) {
        userAchievements.push('First Steps: Completed your profile and onboarding');
      }
      if (userProfile && userProfile.roadmap) {
        userAchievements.push('Roadmap Generated: Your learning path is set!');
      }
      if (streak >= 7) {
        userAchievements.push('Streak Master: Maintained a 7-day streak!');
      }
      setAchievements(userAchievements);
    };
    if (isAuthenticated) fetchAchievements();
  }, [isAuthenticated, userProfile, streak]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 pt-20 pb-10">
      <Navbar />
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-6 text-white"
        >
          Welcome back, {userProfile?.firstName || userProfile?.lastName ? `${userProfile?.firstName || ''}` : 'User'}
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-6 border border-white/10">
              <h2 className="text-xl font-semibold mb-2 text-purple-400">Current Roadmap</h2>
              <AIRoadmap userProfile={userProfile} />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            {/* Streak */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Your Streak</h3>
              <div className="flex gap-2 mb-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`w-6 h-6 rounded-full ${i < streak ? 'bg-purple-600' : 'bg-gray-700 border-2 border-purple-600'}`} />
                ))}
              </div>
              <p className="text-gray-400 text-sm">Keep learning daily to maintain your streak and build momentum!</p>
              <p className="text-purple-400 font-bold mt-2">Current Streak: {streak} days</p>
            </div>
            {/* Weekly Check-in */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Weekly Check-in</h3>
              <p className="text-gray-400 text-sm mb-3">Review your progress and get personalized feedback for the week ahead.</p>
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all duration-200 w-full"
                onClick={() => navigate('/weekly-checkin')}
              >
                Start Check-in
              </button>
            </div>
            {/* Achievements */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Achievements</h3>
              <div className="flex flex-col gap-2">
                {achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <div key={index} className="bg-dark-300 rounded-md p-3 text-gray-200">{achievement}</div>
                  ))
                ) : (
                  <div className="text-gray-400">No achievements yet. Keep learning to unlock achievements!</div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 