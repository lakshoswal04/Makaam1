import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  Map, 
  Calendar, 
  BookOpen, 
  Award, 
  ArrowRight, 
  CheckCircle2,
  Clock,
  TrendingUp,
  Lock
} from 'lucide-react';
import Loading from '../../components/common/Loading';

const db = getFirestore();

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
          
          // Fetch user's roadmap
          // In a real app, this would come from an API call or Firestore
          // For demo purposes, we'll use mock data
          setRoadmap({
            id: 'current',
            title: 'Full Stack Developer Roadmap',
            description: 'A comprehensive path to becoming a proficient full stack developer with React and Node.js',
            progress: 35,
            phases: [
              {
                name: 'Learn',
                description: 'Build your foundational knowledge',
                complete: true,
                topics: ['HTML & CSS', 'JavaScript Fundamentals', 'React Basics']
              },
              {
                name: 'Practice',
                description: 'Apply your skills to real problems',
                complete: false,
                inProgress: true,
                topics: ['Build Interactive UIs', 'State Management', 'API Integration']
              },
              {
                name: 'Build',
                description: 'Create full-stack projects',
                complete: false,
                topics: ['Full Stack Application', 'Database Integration', 'Authentication']
              },
              {
                name: 'Apply',
                description: 'Prepare for job opportunities',
                complete: false,
                topics: ['Portfolio Development', 'Interview Preparation', 'Networking']
              }
            ],
            nextSteps: [
              'Complete React state management project',
              'Start learning about REST API integration',
              'Join the weekly frontend development workshop'
            ],
            streak: 7
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  if (loading) {
    return <Loading />;
  }

  // Fallback for missing userData or roadmap
  if (!userData || !roadmap) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">No user data or roadmap found.</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {userData?.displayName || 'Explorer'}</h1>
            <p className="text-gray-400 mt-2">Track your progress and continue your learning journey</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/checkin" className="btn-primary">
              Weekly Check-in <Calendar className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Roadmap Progress */}
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Map className="mr-2 h-5 w-5 text-primary-500" />
                  Current Roadmap
                </h2>
                <Link to={`/roadmap/${roadmap?.id}`} className="text-primary-400 hover:text-primary-300 flex items-center text-sm">
                  View Full Roadmap <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <h3 className="text-lg font-medium text-white mb-1">{roadmap?.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{roadmap?.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Overall Progress</span>
                  <span className="text-primary-400 font-medium">{roadmap?.progress}%</span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary-500 transition-all duration-500" 
                    style={{ width: `${roadmap?.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {roadmap?.phases.map((phase, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      phase.complete 
                        ? 'border-green-600 bg-green-900/20' 
                        : phase.inProgress 
                          ? 'border-primary-600 bg-primary-900/20' 
                          : 'border-gray-700 bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center mb-2">
                      {phase.complete ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                      ) : phase.inProgress ? (
                        <Clock className="h-5 w-5 text-primary-500 mr-2" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-600 mr-2"></div>
                      )}
                      <span className={`font-medium ${
                        phase.complete 
                          ? 'text-green-400' 
                          : phase.inProgress 
                            ? 'text-primary-400' 
                            : 'text-gray-300'
                      }`}>{phase.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">{phase.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-2">Next Steps:</h4>
                <ul className="space-y-2">
                  {roadmap?.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-5 w-5 rounded-full border-2 border-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                        <span className="text-xs text-primary-500 font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Recent Resources */}
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary-500" />
                  Recommended Resources
                </h2>
                <Link to="/resources" className="text-primary-400 hover:text-primary-300 flex items-center text-sm">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Advanced React Hooks',
                    source: 'React Documentation',
                    type: 'Documentation',
                    url: '#',
                    relevance: 'High'
                  },
                  {
                    title: 'Building a REST API with Node.js',
                    source: 'freeCodeCamp',
                    type: 'Tutorial',
                    url: '#',
                    relevance: 'Medium'
                  },
                  {
                    title: 'State Management in React Applications',
                    source: 'Frontend Masters',
                    type: 'Course',
                    url: '#',
                    relevance: 'High'
                  },
                  {
                    title: 'Handling API Requests in React',
                    source: 'Medium',
                    type: 'Article',
                    url: '#',
                    relevance: 'Medium'
                  }
                ].map((resource, index) => (
                  <a 
                    key={index} 
                    href={resource.url}
                    className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-800 transition-colors flex flex-col"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="font-medium text-white mb-1">{resource.title}</h3>
                    <div className="flex items-center text-sm text-gray-400 mb-2">
                      <span>{resource.source}</span>
                      <span className="mx-2">•</span>
                      <span>{resource.type}</span>
                    </div>
                    <div className="mt-auto">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        resource.relevance === 'High' 
                          ? 'bg-primary-900/40 text-primary-400' 
                          : 'bg-gray-700/50 text-gray-400'
                      }`}>
                        {resource.relevance} Relevance
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <div className="space-y-6">
            {/* Streak Card */}
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary-500" />
                  Your Streak
                </h2>
                <div className="bg-primary-900/30 text-primary-400 px-3 py-1 rounded-full text-sm font-medium">
                  {roadmap?.streak} days
                </div>
              </div>
              
              <div className="flex justify-between mb-3">
                {[...Array(7)].map((_, i) => {
                  const isActive = i < (roadmap?.streak % 7);
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive ? 'bg-primary-500' : 'bg-gray-800'
                      }`}>
                        {isActive && <CheckCircle2 className="h-5 w-5 text-white" />}
                      </div>
                      <span className="text-xs text-gray-400 mt-1">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              <p className="text-sm text-gray-400 mt-2">
                Keep learning daily to maintain your streak and build momentum!
              </p>
            </motion.div>
            
            {/* Upcoming Check-in */}
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 text-primary-500 mr-2" />
                <h2 className="text-xl font-bold text-white">Weekly Check-in</h2>
              </div>
              
              <p className="text-gray-400 mb-4">
                Review your progress and get personalized feedback for the week ahead.
              </p>
              
              <Link to="/checkin" className="btn-primary w-full justify-center">
                Start Check-in
              </Link>
            </motion.div>
            
            {/* Achievements */}
            <motion.div 
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <div className="flex items-center mb-4">
                <Award className="h-5 w-5 text-primary-500 mr-2" />
                <h2 className="text-xl font-bold text-white">Achievements</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'First Steps', description: 'Completed your profile and onboarding', unlocked: true },
                  { name: 'Learning Streak', description: 'Maintained a 7-day learning streak', unlocked: true },
                  { name: 'Resource Explorer', description: 'Accessed 10 different learning resources', unlocked: false }
                ].map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      achievement.unlocked 
                        ? 'border-primary-600 bg-primary-900/20' 
                        : 'border-gray-700 bg-gray-800/30 opacity-60'
                    }`}
                  >
                    <div className="flex items-center">
                      {achievement.unlocked ? (
                        <div className="h-8 w-8 rounded-full bg-primary-500/20 flex items-center justify-center mr-3">
                          <Award className="h-5 w-5 text-primary-400" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                          <Lock className="h-4 w-4 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <h3 className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                          {achievement.name}
                        </h3>
                        <p className="text-xs text-gray-400">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;