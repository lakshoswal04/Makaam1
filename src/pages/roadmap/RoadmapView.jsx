import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Map, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Code, 
  PenTool,
  Download,
  Share2
} from 'lucide-react';
import Loading from '../../components/common/Loading';

const RoadmapView = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState(null);

  useEffect(() => {
    // In a real app, fetch roadmap from API or Firestore
    // For demo purposes, we'll use mock data
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setRoadmap({
          id: 'current',
          title: 'Full Stack Developer Roadmap',
          description: 'A comprehensive path to becoming a proficient full stack developer with React and Node.js',
          progress: 35,
          currentPhase: 1,
          phases: [
            {
              id: 0,
              name: 'Learn',
              description: 'Build your foundational knowledge',
              complete: true,
              topics: [
                {
                  name: 'HTML & CSS Fundamentals',
                  description: 'Learn the building blocks of web development',
                  complete: true,
                  resources: [
                    { type: 'course', name: 'HTML & CSS Crash Course', url: '#', source: 'freeCodeCamp' },
                    { type: 'documentation', name: 'MDN Web Docs - HTML', url: '#', source: 'Mozilla' }
                  ]
                },
                {
                  name: 'JavaScript Basics',
                  description: 'Learn the core language for web programming',
                  complete: true,
                  resources: [
                    { type: 'course', name: 'JavaScript Fundamentals', url: '#', source: 'Codecademy' },
                    { type: 'book', name: 'Eloquent JavaScript', url: '#', source: 'Marijn Haverbeke' }
                  ]
                },
                {
                  name: 'React Fundamentals',
                  description: 'Learn the basics of component-based UI development',
                  complete: true,
                  resources: [
                    { type: 'tutorial', name: 'React Official Tutorial', url: '#', source: 'React Docs' },
                    { type: 'course', name: 'React for Beginners', url: '#', source: 'Wes Bos' }
                  ]
                }
              ]
            },
            {
              id: 1,
              name: 'Practice',
              description: 'Apply your skills to real problems',
              complete: false,
              inProgress: true,
              topics: [
                {
                  name: 'Build Interactive UIs',
                  description: 'Create complex user interfaces with React',
                  complete: true,
                  resources: [
                    { type: 'project', name: 'Build a Todo App', url: '#', source: 'Self-guided' },
                    { type: 'course', name: 'Advanced React Patterns', url: '#', source: 'Frontend Masters' }
                  ]
                },
                {
                  name: 'State Management',
                  description: 'Learn to manage application state effectively',
                  complete: false,
                  inProgress: true,
                  resources: [
                    { type: 'documentation', name: 'Redux Documentation', url: '#', source: 'Redux' },
                    { type: 'tutorial', name: 'Context API Deep Dive', url: '#', source: 'React Docs' }
                  ]
                },
                {
                  name: 'API Integration',
                  description: 'Connect your frontend to backend services',
                  complete: false,
                  resources: [
                    { type: 'tutorial', name: 'Fetching Data with React', url: '#', source: 'Robin Wieruch' },
                    { type: 'documentation', name: 'Axios Documentation', url: '#', source: 'Axios' }
                  ]
                }
              ]
            },
            {
              id: 2,
              name: 'Build',
              description: 'Create full-stack projects',
              complete: false,
              topics: [
                {
                  name: 'Node.js & Express',
                  description: 'Build server-side applications with JavaScript',
                  complete: false,
                  resources: [
                    { type: 'course', name: 'Learn Node.js', url: '#', source: 'Udemy' },
                    { type: 'documentation', name: 'Express.js Guide', url: '#', source: 'Express' }
                  ]
                },
                {
                  name: 'Database Integration',
                  description: 'Connect and query databases from your application',
                  complete: false,
                  resources: [
                    { type: 'tutorial', name: 'MongoDB with Node.js', url: '#', source: 'MongoDB University' },
                    { type: 'documentation', name: 'Mongoose Documentation', url: '#', source: 'Mongoose' }
                  ]
                },
                {
                  name: 'Authentication & Security',
                  description: 'Implement user authentication and secure your app',
                  complete: false,
                  resources: [
                    { type: 'course', name: 'Web Security Fundamentals', url: '#', source: 'Pluralsight' },
                    { type: 'tutorial', name: 'JWT Authentication', url: '#', source: 'Auth0 Blog' }
                  ]
                }
              ]
            },
            {
              id: 3,
              name: 'Apply',
              description: 'Prepare for job opportunities',
              complete: false,
              topics: [
                {
                  name: 'Portfolio Development',
                  description: 'Showcase your projects and skills',
                  complete: false,
                  resources: [
                    { type: 'guide', name: 'Developer Portfolio Guide', url: '#', source: 'freeCodeCamp' },
                    { type: 'examples', name: 'Inspiring Developer Portfolios', url: '#', source: 'Awwwards' }
                  ]
                },
                {
                  name: 'Technical Interview Preparation',
                  description: 'Practice coding challenges and system design',
                  complete: false,
                  resources: [
                    { type: 'platform', name: 'LeetCode', url: '#', source: 'LeetCode' },
                    { type: 'book', name: 'Cracking the Coding Interview', url: '#', source: 'Gayle L. McDowell' }
                  ]
                },
                {
                  name: 'Job Search & Networking',
                  description: 'Find opportunities and connect with professionals',
                  complete: false,
                  resources: [
                    { type: 'community', name: 'Tech Career Growth Community', url: '#', source: 'Discord' },
                    { type: 'guide', name: 'Developer Resume Guide', url: '#', source: 'Dev.to' }
                  ]
                }
              ]
            }
          ],
          estimatedTimeToComplete: '6-8 months',
          difficulty: 'Intermediate',
          prerequisites: ['Basic HTML/CSS knowledge', 'Familiarity with programming concepts']
        });
      } catch (error) {
        console.error('Error fetching roadmap:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [id]);

  const togglePhase = (phaseId) => {
    if (expandedPhase === phaseId) {
      setExpandedPhase(null);
    } else {
      setExpandedPhase(phaseId);
    }
  };

  const handleMarkComplete = (phaseId, topicIndex) => {
    // In a real app, this would update the database
    setRoadmap(prevRoadmap => {
      const updatedRoadmap = {...prevRoadmap};
      const phase = updatedRoadmap.phases.find(p => p.id === phaseId);
      
      if (phase && phase.topics[topicIndex]) {
        phase.topics[topicIndex].complete = true;
        phase.topics[topicIndex].inProgress = false;
        
        // Check if all topics in phase are complete
        const allTopicsComplete = phase.topics.every(topic => topic.complete);
        if (allTopicsComplete) {
          phase.complete = true;
          phase.inProgress = false;
          
          // Set next phase to in progress
          const nextPhaseIndex = updatedRoadmap.phases.findIndex(p => p.id === phaseId) + 1;
          if (nextPhaseIndex < updatedRoadmap.phases.length) {
            updatedRoadmap.phases[nextPhaseIndex].inProgress = true;
            if (updatedRoadmap.phases[nextPhaseIndex].topics.length > 0) {
              updatedRoadmap.phases[nextPhaseIndex].topics[0].inProgress = true;
            }
          }
        }
        
        // Update progress percentage
        const totalTopics = updatedRoadmap.phases.reduce((acc, phase) => acc + phase.topics.length, 0);
        const completedTopics = updatedRoadmap.phases.reduce((acc, phase) => 
          acc + phase.topics.filter(topic => topic.complete).length, 0);
        
        updatedRoadmap.progress = Math.round((completedTopics / totalTopics) * 100);
      }
      
      return updatedRoadmap;
    });
  };

  const handleMarkInProgress = (phaseId, topicIndex) => {
    // In a real app, this would update the database
    setRoadmap(prevRoadmap => {
      const updatedRoadmap = {...prevRoadmap};
      const phase = updatedRoadmap.phases.find(p => p.id === phaseId);
      
      if (phase && phase.topics[topicIndex]) {
        // First, reset any other in-progress topics
        updatedRoadmap.phases.forEach(p => {
          p.topics.forEach(t => {
            t.inProgress = false;
          });
          p.inProgress = false;
        });
        
        // Set this topic and its phase to in progress
        phase.topics[topicIndex].inProgress = true;
        phase.inProgress = true;
        
        updatedRoadmap.currentPhase = phaseId;
      }
      
      return updatedRoadmap;
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-white flex items-center">
                <Map className="mr-3 h-8 w-8 text-primary-500" />
                {roadmap.title}
              </h1>
              <p className="text-gray-400 mt-2">{roadmap.description}</p>
            </div>
            
            
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-900/30 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Estimated Time</p>
                <p className="text-white font-medium">{roadmap.estimatedTimeToComplete}</p>
              </div>
            </div>
            
            <div className="glass-card p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-900/30 flex items-center justify-center mr-3">
                <Code className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Difficulty</p>
                <p className="text-white font-medium">{roadmap.difficulty}</p>
              </div>
            </div>
            
            <div className="glass-card p-4 flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-900/30 flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Prerequisites</p>
                <p className="text-white font-medium">{roadmap.prerequisites.join(', ')}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 mb-8">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-primary-400 font-medium">{roadmap.progress}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-500" 
                style={{ width: `${roadmap.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          {roadmap.phases.map((phase) => (
            <motion.div 
              key={phase.id}
              className="glass-card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: phase.id * 0.1 }}
            >
              <div 
                className={`p-6 cursor-pointer ${
                  phase.complete 
                    ? 'bg-green-900/10 border-l-4 border-green-600' 
                    : phase.inProgress 
                      ? 'bg-primary-900/10 border-l-4 border-primary-600' 
                      : 'bg-gray-800/30'
                }`}
                onClick={() => togglePhase(phase.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {phase.complete ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500 mr-3" />
                    ) : phase.inProgress ? (
                      <Clock className="h-6 w-6 text-primary-500 mr-3" />
                    ) : (
                      <div className="h-6 w-6 rounded-full border-2 border-gray-600 mr-3"></div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">{phase.name}</h2>
                      <p className="text-gray-400">{phase.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-3 ${
                      phase.complete 
                        ? 'text-green-400' 
                        : phase.inProgress 
                          ? 'text-primary-400' 
                          : 'text-gray-500'
                    }`}>
                      {phase.complete 
                        ? 'Completed' 
                        : phase.inProgress 
                          ? 'In Progress' 
                          : 'Not Started'}
                    </span>
                    <ArrowRight className={`h-5 w-5 text-gray-400 transition-transform ${
                      expandedPhase === phase.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </div>
              </div>
              
              {expandedPhase === phase.id && (
                <div className="p-6 border-t border-gray-800">
                  {phase.topics.map((topic, topicIndex) => (
                    <div 
                      key={topicIndex}
                      className={`mb-6 last:mb-0 ${
                        topic.complete 
                          ? 'opacity-75' 
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start">
                          {topic.complete ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          ) : topic.inProgress ? (
                            <Clock className="h-5 w-5 text-primary-500 mt-0.5 mr-3 flex-shrink-0" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-gray-600 mt-0.5 mr-3 flex-shrink-0"></div>
                          )}
                          <div>
                            <h3 className="text-lg font-medium text-white">{topic.name}</h3>
                            <p className="text-gray-400 text-sm">{topic.description}</p>
                          </div>
                        </div>
                        
                        {!topic.complete && (
                          <div className="flex items-center space-x-2">
                            {!topic.inProgress && (
                              <button 
                                onClick={() => handleMarkInProgress(phase.id, topicIndex)}
                                className="px-2 py-1 bg-primary-900/30 text-primary-400 text-xs rounded hover:bg-primary-800/40 transition-colors"
                              >
                                Start
                              </button>
                            )}
                            {topic.inProgress && (
                              <button 
                                onClick={() => handleMarkComplete(phase.id, topicIndex)}
                                className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded hover:bg-green-800/40 transition-colors"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-8">
                        <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                          <BookOpen className="h-4 w-4 mr-1 text-primary-400" />
                          Resources
                        </h4>
                        <div className="space-y-2">
                          {topic.resources.map((resource, resIndex) => (
                            <a 
                              key={resIndex}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-2 bg-gray-800/40 rounded hover:bg-gray-800 transition-colors"
                            >
                              <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center mr-3">
                                {resource.type === 'course' && <BookOpen className="h-4 w-4 text-primary-400" />}
                                {resource.type === 'documentation' && <Code className="h-4 w-4 text-primary-400" />}
                                {resource.type === 'tutorial' && <PenTool className="h-4 w-4 text-primary-400" />}
                                {resource.type === 'book' && <BookOpen className="h-4 w-4 text-primary-400" />}
                                {resource.type === 'project' && <Code className="h-4 w-4 text-primary-400" />}
                              </div>
                              <div>
                                <p className="text-white text-sm font-medium">{resource.name}</p>
                                <div className="flex items-center">
                                  <span className="text-xs text-gray-400">{resource.source}</span>
                                  <span className="mx-1 text-gray-600">•</span>
                                  <span className="text-xs text-gray-400 capitalize">{resource.type}</span>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadmapView;