import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ArrowLeft
} from 'lucide-react';
import Loading from '../../components/common/Loading';

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
  const [checkinComplete, setCheckinComplete] = useState(false);
  const navigate = useNavigate();

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
    
    // Simulate API response delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI responses based on message count
    let aiResponse;
    
    if (messages.length === 1) {
      aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: "Great to hear from you! What specific challenges did you face while working on React state management? Understanding your obstacles will help me provide better guidance for next week.",
        timestamp: new Date().toISOString()
      };
    } else if (messages.length === 3) {
      aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: "I understand managing complex state can be challenging. For your next steps, I recommend trying the Context API with useReducer for your project. Would you like me to suggest some specific resources on this topic?",
        timestamp: new Date().toISOString()
      };
    } else if (messages.length === 5) {
      aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: "I've added some resources to your dashboard about state management patterns. For next week, try implementing the pattern we discussed in a small project. What specific goal would you like to set for the coming week?",
        timestamp: new Date().toISOString()
      };
    } else if (messages.length === 7) {
      aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: "That's an excellent goal! I've updated your roadmap with this milestone. Is there anything else you'd like help with today?",
        timestamp: new Date().toISOString()
      };
    } else if (messages.length === 9) {
      aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: "Great! I've summarized our check-in and updated your learning plan. Your dedication is paying off - you've maintained a 7-day streak! See you next week for another check-in. Keep up the great work!",
        timestamp: new Date().toISOString(),
        isLastMessage: true
      };
      setCheckinComplete(true);
    } else {
      aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: "I understand. Let's focus on breaking down this challenge into smaller steps. What specific aspect would you like to tackle first?",
        timestamp: new Date().toISOString()
      };
    }
    
    setMessages(prev => [...prev, aiResponse]);
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <MessageSquare className="mr-3 h-8 w-8 text-primary-500" />
            Weekly Check-in
          </h1>
          
          {checkinComplete && (
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-secondary"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Dashboard
            </button>
          )}
        </div>
        
        {checkinComplete ? (
          <motion.div 
            className="glass-card p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Check-in Complete!</h2>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              Your progress has been recorded and your roadmap has been updated based on your feedback.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass-card p-4 bg-gray-800/50">
                <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h3 className="font-bold text-white mb-1">7-Day Streak</h3>
                <p className="text-gray-400 text-sm">Keep up the momentum!</p>
              </div>
              
              <div className="glass-card p-4 bg-gray-800/50">
                <PenTool className="h-8 w-8 text-primary-500 mx-auto mb-2" />
                <h3 className="font-bold text-white mb-1">New Resources</h3>
                <p className="text-gray-400 text-sm">Added to your dashboard</p>
              </div>
              
              <div className="glass-card p-4 bg-gray-800/50">
                <Clock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h3 className="font-bold text-white mb-1">Next Check-in</h3>
                <p className="text-gray-400 text-sm">In 7 days</p>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary px-6"
            >
              Return to Dashboard
            </button>
          </motion.div>
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