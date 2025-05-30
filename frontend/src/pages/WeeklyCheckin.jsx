import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheck, FaSpinner } from 'react-icons/fa';

// Helper to flatten roadmap items
const getAllRoadmapItems = (roadmap) => {
  if (!roadmap) return [];
  const phases = ['learn', 'practice', 'build', 'apply'];
  let items = [];
  phases.forEach(phase => {
    if (roadmap[phase]) {
      if (Array.isArray(roadmap[phase].topics)) {
        items = items.concat(roadmap[phase].topics.map(topic => ({ phase, type: 'topic', value: topic })));
      }
      if (Array.isArray(roadmap[phase].projects)) {
        items = items.concat(roadmap[phase].projects.map(project => ({ phase, type: 'project', value: project })));
      }
    }
  });
  return items;
};

const getPhaseProgress = (phase, completedItems, roadmap) => {
  if (!roadmap?.[phase]) return 0;
  const phaseItems = [
    ...(roadmap[phase].topics || []),
    ...(roadmap[phase].projects || [])
  ];
  if (phaseItems.length === 0) return 0;
  const completed = phaseItems.filter(item => completedItems.includes(item)).length;
  return Math.round((completed / phaseItems.length) * 100);
};

const WeeklyCheckin = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [reflections, setReflections] = useState('');
  const [progress, setProgress] = useState(0);
  const [completedItems, setCompletedItems] = useState([]);
  const [previousCheckins, setPreviousCheckins] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const allRoadmapItems = getAllRoadmapItems(userProfile?.roadmap);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching check-ins...');
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const res = await axios.get('/api/checkins', {
          headers: { 'x-auth-token': token }
        });
        console.log('Check-ins response:', res.data);
        
        setPreviousCheckins(res.data.checkins || []);
        
        // Get completed items from the latest check-in
        if (res.data.checkins && res.data.checkins.length > 0) {
          const latestCheckin = res.data.checkins[0];
          setCompletedItems(latestCheckin.completedRoadmapItems || []);
          setProgress(latestCheckin.progress || 0);
        }
      } catch (err) {
        console.error('Failed to fetch check-ins:', err);
        setError('Failed to load check-ins. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCheckins();
    }
  }, [isAuthenticated]);

  const toggleRoadmapItem = (itemValue) => {
    setCompletedItems(prev => {
      const newItems = prev.includes(itemValue)
        ? prev.filter(i => i !== itemValue)
        : [...prev, itemValue];
      // Calculate progress based on completed items
      const totalItems = allRoadmapItems.length;
      const newProgress = totalItems > 0 ? (newItems.length / totalItems) * 100 : 0;
      setProgress(newProgress);
      return newItems;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.post(
        '/api/checkins',
        {
          reflections,
          progress,
          completedRoadmapItems: completedItems
        },
        {
          headers: { 'x-auth-token': token }
        }
      );
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to submit check-in:', err);
      setError(err.response?.data?.message || 'Failed to submit check-in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
            {error}
          </div>
        </div>
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
          className="flex items-center mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Weekly Reflection</h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={reflections}
                  onChange={(e) => setReflections(e.target.value)}
                  placeholder="How was your learning journey this week? What challenges did you face? What are your goals for next week?"
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
                {error && (
                  <p className="text-red-400 mt-2">{error}</p>
                )}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 w-full"
                >
                  {isSubmitting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Submit Check-in
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Roadmap Progress</h2>
              <div className="space-y-6">
                {['learn', 'practice', 'build', 'apply'].map(phase => (
                  userProfile?.roadmap?.[phase] && (
                    <div key={phase}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-purple-400 capitalize">{phase}</h3>
                        <span className="text-sm text-purple-300">{getPhaseProgress(phase, completedItems, userProfile.roadmap)}%</span>
                      </div>
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${getPhaseProgress(phase, completedItems, userProfile.roadmap)}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-blue-600"
                          style={{ width: `${getPhaseProgress(phase, completedItems, userProfile.roadmap)}%` }}
                        />
                      </div>
                      <div className="space-y-2">
                        {userProfile.roadmap[phase].topics && userProfile.roadmap[phase].topics.map((topic, idx) => (
                          <div key={phase + '-topic-' + idx} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10">
                            <input
                              type="checkbox"
                              checked={completedItems.includes(topic)}
                              onChange={() => toggleRoadmapItem(topic)}
                              className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-white">{topic}</span>
                          </div>
                        ))}
                        {userProfile.roadmap[phase].projects && userProfile.roadmap[phase].projects.map((project, idx) => (
                          <div key={phase + '-project-' + idx} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/10">
                            <input
                              type="checkbox"
                              checked={completedItems.includes(project)}
                              onChange={() => toggleRoadmapItem(project)}
                              className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-white">{project}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Progress Overview</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-200 bg-purple-200/10">
                      Progress
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-purple-200">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-blue-600"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4">Previous Check-ins</h3>
              <div className="space-y-4">
                {previousCheckins.length > 0 ? (
                  previousCheckins.map((checkin, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <p className="text-gray-400 text-sm mb-2">
                        {new Date(checkin.date).toLocaleDateString()}
                      </p>
                      <p className="text-white">{checkin.reflections}</p>
                      <div className="mt-2 text-sm text-purple-400">
                        Progress: {Math.round(checkin.progress)}%
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400">No previous check-ins yet.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyCheckin; 