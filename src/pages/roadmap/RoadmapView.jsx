import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Share2,
  ExternalLink
} from 'lucide-react';
import Loading from '../../components/common/Loading';
import { doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.config';

const RoadmapView = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedPhase, setExpandedPhase] = useState(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        
        // Try to fetch roadmap from Firestore
        if (id) {
          const roadmapRef = doc(db, 'roadmaps', id);
          const roadmapSnap = await getDoc(roadmapRef);
          
          if (roadmapSnap.exists()) {
            setRoadmap({
              id: roadmapSnap.id,
              ...roadmapSnap.data()
            });
            setLoading(false);
            return;
          }
        }
        
        // If no roadmap found or no id provided, use mock data
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
                    { type: 'course', name: 'HTML & CSS Crash Course', url: 'https://www.freecodecamp.org/learn/responsive-web-design/', source: 'freeCodeCamp' },
                    { type: 'documentation', name: 'MDN Web Docs - HTML', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML', source: 'Mozilla' }
                  ]
                },
                {
                  name: 'JavaScript Basics',
                  description: 'Learn the core language for web programming',
                  complete: true,
                  resources: [
                    { type: 'course', name: 'JavaScript Fundamentals', url: 'https://www.codecademy.com/learn/introduction-to-javascript', source: 'Codecademy' },
                    { type: 'book', name: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net/', source: 'Marijn Haverbeke' }
                  ]
                },
                {
                  name: 'React Fundamentals',
                  description: 'Learn the basics of component-based UI development',
                  complete: true,
                  resources: [
                    { type: 'tutorial', name: 'React Official Tutorial', url: 'https://react.dev/learn', source: 'React Docs' },
                    { type: 'course', name: 'React for Beginners', url: 'https://reactforbeginners.com/', source: 'Wes Bos' }
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
                    { type: 'project', name: 'Build a Todo App', url: 'https://github.com/topics/react-todo-app', source: 'Self-guided' },
                    { type: 'course', name: 'Advanced React Patterns', url: 'https://frontendmasters.com/courses/advanced-react-patterns/', source: 'Frontend Masters' }
                  ]
                },
                {
                  name: 'State Management',
                  description: 'Learn to manage application state effectively',
                  complete: false,
                  inProgress: true,
                  resources: [
                    { type: 'documentation', name: 'Redux Documentation', url: 'https://redux.js.org/', source: 'Redux' },
                    { type: 'tutorial', name: 'Context API Deep Dive', url: 'https://react.dev/reference/react/useContext', source: 'React Docs' }
                  ]
                },
                {
                  name: 'API Integration',
                  description: 'Connect your frontend to backend services',
                  complete: false,
                  resources: [
                    { type: 'tutorial', name: 'Fetching Data with React', url: 'https://www.robinwieruch.de/react-fetching-data/', source: 'Robin Wieruch' },
                    { type: 'documentation', name: 'Axios Documentation', url: 'https://axios-http.com/docs/intro', source: 'Axios' }
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
                    { type: 'course', name: 'Learn Node.js', url: 'https://www.udemy.com/course/nodejs-the-complete-guide/', source: 'Udemy' },
                    { type: 'documentation', name: 'Express.js Guide', url: 'https://expressjs.com/en/guide/routing.html', source: 'Express' }
                  ]
                },
                {
                  name: 'Database Integration',
                  description: 'Connect and query databases from your application',
                  complete: false,
                  resources: [
                    { type: 'tutorial', name: 'MongoDB with Node.js', url: 'https://www.mongodb.com/developer/quickstart/node-crud-tutorial/', source: 'MongoDB University' },
                    { type: 'documentation', name: 'Mongoose Documentation', url: 'https://mongoosejs.com/docs/guide.html', source: 'Mongoose' }
                  ]
                },
                {
                  name: 'Authentication & Security',
                  description: 'Implement user authentication and secure your app',
                  complete: false,
                  resources: [
                    { type: 'course', name: 'Web Security Fundamentals', url: 'https://www.pluralsight.com/courses/web-security-fundamentals', source: 'Pluralsight' },
                    { type: 'tutorial', name: 'JWT Authentication', url: 'https://auth0.com/docs/authenticate/protocols/oauth2/oauth2-with-jwt', source: 'Auth0 Blog' }
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
                    { type: 'guide', name: 'Developer Portfolio Guide', url: 'https://www.freecodecamp.org/news/how-to-build-a-portfolio-website-as-a-developer/', source: 'freeCodeCamp' },
                    { type: 'examples', name: 'Inspiring Developer Portfolios', url: 'https://www.awwwards.com/websites/portfolio/', source: 'Awwwards' }
                  ]
                },
                {
                  name: 'Technical Interview Preparation',
                  description: 'Practice coding challenges and system design',
                  complete: false,
                  resources: [
                    { type: 'platform', name: 'LeetCode', url: 'https://leetcode.com/', source: 'LeetCode' },
                    { type: 'book', name: 'Cracking the Coding Interview', url: 'https://www.crackingthecodinginterview.com/', source: 'Gayle L. McDowell' }
                  ]
                },
                {
                  name: 'Job Search & Networking',
                  description: 'Find opportunities and connect with professionals',
                  complete: false,
                  resources: [
                    { type: 'community', name: 'Tech Career Growth Community', url: 'https://discord.com/invite/techcareergrowth', source: 'Discord' },
                    { type: 'guide', name: 'Developer Resume Guide', url: 'https://dev.to/alexandriawilliams/how-to-write-a-developer-resume-2f0i', source: 'Dev.to' }
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

  const handleMarkComplete = async (phaseId, topicIndex) => {
    setRoadmap(prevRoadmap => {
      const updatedPhases = [...prevRoadmap.phases];
      
      // Find the phase
      const phaseIndex = updatedPhases.findIndex(phase => phase.id === phaseId);
      if (phaseIndex === -1) return prevRoadmap;
      
      // Update the topic
      const updatedTopics = [...updatedPhases[phaseIndex].topics];
      updatedTopics[topicIndex] = {
        ...updatedTopics[topicIndex],
        complete: true,
        inProgress: false
      };
      
      // Update the phase
      updatedPhases[phaseIndex] = {
        ...updatedPhases[phaseIndex],
        topics: updatedTopics
      };
      
      // Check if all topics in the phase are complete
      const allTopicsComplete = updatedTopics.every(topic => topic.complete);
      if (allTopicsComplete) {
        updatedPhases[phaseIndex].complete = true;
        updatedPhases[phaseIndex].inProgress = false;
      }
      
      // Calculate overall progress
      const totalTopics = updatedPhases.reduce((total, phase) => total + phase.topics.length, 0);
      const completedTopics = updatedPhases.reduce((total, phase) => {
        return total + phase.topics.filter(topic => topic.complete).length;
      }, 0);
      
      const progress = Math.round((completedTopics / totalTopics) * 100);
      
      const updatedRoadmap = {
        ...prevRoadmap,
        phases: updatedPhases,
        progress
      };
      
      // Update in Firestore if this is a real roadmap (has a string id)
      if (typeof prevRoadmap.id === 'string') {
        const roadmapRef = doc(db, 'roadmaps', prevRoadmap.id);
        updateDoc(roadmapRef, updatedRoadmap).catch(error => {
          console.error('Error updating roadmap:', error);
        });
      }
      
      return updatedRoadmap;
    });
  };

  const handleMarkInProgress = async (phaseId, topicIndex) => {
    setRoadmap(prevRoadmap => {
      const updatedPhases = [...prevRoadmap.phases];
      
      // Find the phase
      const phaseIndex = updatedPhases.findIndex(phase => phase.id === phaseId);
      if (phaseIndex === -1) return prevRoadmap;
      
      // Update the topic
      const updatedTopics = [...updatedPhases[phaseIndex].topics];
      updatedTopics[topicIndex] = {
        ...updatedTopics[topicIndex],
        inProgress: true
      };
      
      // Update the phase
      updatedPhases[phaseIndex] = {
        ...updatedPhases[phaseIndex],
        topics: updatedTopics,
        inProgress: true
      };
      
      const updatedRoadmap = {
        ...prevRoadmap,
        phases: updatedPhases
      };
      
      // Update in Firestore if this is a real roadmap (has a string id)
      if (typeof prevRoadmap.id === 'string') {
        const roadmapRef = doc(db, 'roadmaps', prevRoadmap.id);
        updateDoc(roadmapRef, updatedRoadmap).catch(error => {
          console.error('Error updating roadmap:', error);
        });
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
                              className="flex items-center p-2 bg-gray-800/40 rounded hover:bg-gray-800 transition-colors group"
                              onClick={() => console.log(`Resource clicked: ${resource.name}`)}
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