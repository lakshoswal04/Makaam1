import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Clock, 
  ThumbsUp, 
  ThumbsDown, 
  Award, 
  HelpCircle, 
  CheckCircle,
  Frown,
  PenTool,
  ArrowLeft,
  Flame
} from 'lucide-react';
import Loading from '../../components/common/Loading';

const db = getFirestore();

const WeeklyCheckin = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'ai', 
      text: "Hi there! Welcome to your weekly check-in. How has your progress been this week?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [checkinComplete, setCheckinComplete] = useState(false);
  const [userData, setUserData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [streak, setStreak] = useState(0);
  const [checkInData, setCheckInData] = useState({
    progress: '',
    challenges: '',
    goals: '',
    questions: ''
  });
  const [checkInStep, setCheckInStep] = useState(0);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Fetch user data and roadmap on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (currentUser && currentUser.uid) {
          console.log('Fetching data for user:', currentUser.uid);
          
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserData(userData);
              setStreak(userData.streak || 0);
              
              // Fetch user's assigned roadmap if it exists
              if (userData.assignedRoadmapId) {
                const roadmapDoc = await getDoc(doc(db, 'roadmaps', userData.assignedRoadmapId));
                if (roadmapDoc.exists()) {
                  setRoadmapData(roadmapDoc.data());
                }
              }
            } else {
              console.log('User document does not exist');
            }
          } catch (firestoreError) {
            console.error('Firestore permission error:', firestoreError);
            // Continue with default values if we can't access Firestore
          }
        } else {
          console.warn('No authenticated user found');
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Update check-in data based on user messages
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === 'user') {
      const userMessage = messages[messages.length - 1].text;
      
      if (checkInStep === 0) {
        setCheckInData(prev => ({ ...prev, progress: userMessage }));
        setCheckInStep(1);
      } else if (checkInStep === 1) {
        setCheckInData(prev => ({ ...prev, challenges: userMessage }));
        setCheckInStep(2);
      } else if (checkInStep === 2) {
        setCheckInData(prev => ({ ...prev, goals: userMessage }));
        setCheckInStep(3);
      } else if (checkInStep === 3) {
        setCheckInData(prev => ({ ...prev, questions: userMessage }));
        setCheckInStep(4);
      }
    }
  }, [messages, checkInStep]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);
    
    // If this is the final step, send the check-in data to the server
    if (checkInStep === 3) {
      try {
        // Ensure we have a valid user ID before making the request
        if (!currentUser || !currentUser.uid) {
          throw new Error('No authenticated user found');
        }
        
        console.log('Submitting check-in for user:', currentUser.uid);
        
        const response = await axios.post('http://localhost:5000/api/checkin', {
          progress: checkInData.progress,
          challenges: checkInData.challenges,
          goals: checkInData.goals,
          questions: inputMessage, // The current message is the questions
          userId: currentUser.uid
        });
        
        // Update streak if returned from the server
        if (response.data.streak) {
          setStreak(response.data.streak);
        }
        
        const aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          text: response.data.response,
          timestamp: new Date().toISOString(),
          isLastMessage: true
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setCheckinComplete(true);
      } catch (error) {
        console.error('Error submitting check-in:', error.response?.data || error.message);
        
        let errorMessage = "I'm sorry, I encountered an error processing your check-in. Please try again later.";
        
        // Check for specific error types
        if (error.message?.includes('No authenticated user')) {
          errorMessage = "You need to be logged in to submit a check-in. Please log in and try again.";
        } else if (error.response?.data?.error?.includes('permission denied')) {
          errorMessage = "There was a permission error accessing your data. This might be due to authentication issues. Please try logging out and back in.";
        }
        
        // Fallback response if the API call fails
        const aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          text: errorMessage,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, aiResponse]);
      }
    } else {
      // Generate appropriate AI response based on the current step
      let aiResponse;
      
      if (checkInStep === 0) {
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          text: "Thanks for sharing your progress! What challenges did you face this week?",
          timestamp: new Date().toISOString()
        };
      } else if (checkInStep === 1) {
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          text: "I understand those challenges. What are your goals for next week?",
          timestamp: new Date().toISOString()
        };
      } else if (checkInStep === 2) {
        aiResponse = {
          id: messages.length + 2,
          sender: 'ai',
          text: "Those are great goals! Do you have any specific questions about your roadmap or learning journey?",
          timestamp: new Date().toISOString()
        };
      }
      
      setMessages(prev => [...prev, aiResponse]);
    }
    
    setLoading(false);
  };

  const getTimeString = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAiMessageIcon = (message) => {
    if (message.isLastMessage) {
      return <Award className="h-6 w-6 text-primary-500" />;
    }
    return <MessageSquare className="h-6 w-6 text-primary-500" />;
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <MessageSquare className="h-8 w-8 text-primary-500 mr-3" />
            Weekly Check-in
          </h1>
          
          {/* Streak counter */}
          <div className="flex items-center bg-primary-900/30 px-4 py-2 rounded-full">
            <Flame className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-white font-bold">{streak}</span>
            <span className="text-gray-400 ml-1">day streak</span>
          </div>
        </div>
        
        {initialLoading ? (
          <Loading />
        ) : checkinComplete ? (
          <div className="glass-card p-8 text-center">
            <div className="mb-6">
              <div className="bg-primary-900/30 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-primary-500" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Check-in Complete!</h2>
              <p className="text-gray-400 mb-6">Your weekly progress has been recorded and your roadmap has been updated.</p>
              
              {streak > 0 && (
                <div className="bg-primary-900/30 rounded-lg p-4 mb-6 inline-block">
                  <div className="flex items-center justify-center">
                    <Flame className="h-6 w-6 text-orange-500 mr-2" />
                    <span className="text-white font-bold text-lg">{streak}-day streak!</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">Keep it up to unlock achievements</p>
                </div>
              )}
              
              <div className="bg-primary-900/30 rounded-lg p-4 inline-block">
                <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-bold text-white mb-1">Next Check-in</h3>
                <p className="text-gray-400 text-sm">In 7 days</p>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button 
                className="btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </button>
              <button 
                className="btn-secondary"
                onClick={() => navigate('/roadmap/current')}
              >
                View Updated Roadmap
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
            <div className="bg-gray-800/30 px-6 py-4 border-b border-gray-800">
              <div className="flex items-center">
                <div className="bg-primary-500/20 w-12 h-12 rounded-full flex items-center justify-center mr-3">
                  <MessageSquare className="h-6 w-6 text-primary-400" />
                </div>
                <div>
                  <h2 className="font-bold text-white">AI Career Coach</h2>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-sm text-gray-400">Online</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  className={`mb-6 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div 
                    className={`max-w-[80%] ${
                      message.sender === 'user' 
                        ? 'bg-primary-900/30 text-white rounded-t-lg rounded-bl-lg' 
                        : 'bg-gray-800 text-white rounded-t-lg rounded-br-lg'
                    } p-4`}
                  >
                    {message.sender === 'ai' && (
                      <div className="flex items-center mb-2">
                        {getAiMessageIcon(message)}
                        <span className="font-bold ml-2">AI Career Coach</span>
                      </div>
                    )}
                    <p className="text-gray-100">{message.text}</p>
                    <div className={`mt-2 text-xs ${message.sender === 'user' ? 'text-primary-300' : 'text-gray-400'} flex items-center`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeString(message.timestamp)}
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {loading && (
                <motion.div
                  className="mb-6 flex justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="bg-gray-800 text-white rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center">
                      <MessageSquare className="h-6 w-6 text-primary-500 mr-2" />
                      <span className="font-bold">AI Career Coach</span>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <form onSubmit={sendMessage} className="flex items-center">
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder="Type your message..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={loading || checkinComplete}
                />
                <button
                  type="submit"
                  className="ml-2 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!inputMessage.trim() || loading || checkinComplete}
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
              
              <div className="mt-3 flex justify-center space-x-4 text-sm text-gray-400">
                <button className="flex items-center hover:text-primary-400 transition-colors">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>Helpful</span>
                </button>
                <button className="flex items-center hover:text-primary-400 transition-colors">
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  <span>Not helpful</span>
                </button>
                <button className="flex items-center hover:text-primary-400 transition-colors">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  <span>Get help</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyCheckin;