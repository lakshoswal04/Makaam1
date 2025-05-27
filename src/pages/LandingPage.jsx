import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Compass, 
  BarChart, 
  BookOpen, 
  Map, 
  Calendar, 
  CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 to-transparent z-0"></div>
        <div className="absolute top-20 left-0 w-full h-full bg-hero-pattern opacity-5 z-0"></div>
        
        <motion.div 
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <motion.div
              className="inline-block"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            >
              <Compass className="h-16 w-16 mx-auto text-primary-500" />
            </motion.div>
            
            <motion.h1 
              className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <span className="block text-white">Find Your Path</span>
              <span className="block bg-gradient-to-r from-primary-400 to-accent-500 bg-clip-text text-transparent">
                Discover Your Career
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 max-w-lg mx-auto text-xl text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Your personalized AI career guide. Get a customized roadmap,
              curated resources, and ongoing support tailored to your goals.
            </motion.p>
            
            <motion.div 
              className="mt-10 flex justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link 
                to="/register" 
                className="btn-primary px-8 py-3 rounded-full shadow-lg shadow-primary-600/20"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="btn-secondary px-8 py-3 rounded-full"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="mt-20 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <img 
              src="https://placehold.co/1200x600/252945/FFFFFF/png?text=PathFinder+Dashboard+Preview" 
              alt="PathFinder Dashboard Preview" 
              className="w-full h-auto rounded-xl shadow-2xl glass-card" 
            />
          </motion.div>
        </motion.div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How PathFinder Works</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Navigate your career journey with confidence using our AI-powered roadmap
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart className="h-8 w-8 text-primary-500" />,
                title: 'Personalized Assessment',
                description: 'Share your interests, skills, and career goals to get a customized roadmap.'
              },
              {
                icon: <Map className="h-8 w-8 text-primary-500" />,
                title: 'AI Career Roadmap',
                description: 'Receive a detailed learning path with step-by-step guidance for your career goals.'
              },
              {
                icon: <BookOpen className="h-8 w-8 text-primary-500" />,
                title: 'Curated Resources',
                description: 'Access hand-picked learning materials, courses, and projects for each step.'
              },
              {
                icon: <CheckCircle2 className="h-8 w-8 text-primary-500" />,
                title: 'Progress Tracking',
                description: 'Mark your progress and stay motivated as you complete each milestone.'
              },
              {
                icon: <Calendar className="h-8 w-8 text-primary-500" />,
                title: 'Weekly Check-ins',
                description: 'Get AI-powered guidance and feedback to keep you on track and motivated.'
              },
              {
                icon: <Compass className="h-8 w-8 text-primary-500" />,
                title: 'Explore Opportunities',
                description: 'Discover new career paths and opportunities aligned with your skills and interests.'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="glass-card p-6 card-hover"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="rounded-full bg-gray-800 w-14 h-14 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Your Career Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of students who have found their path with AI-powered guidance.
            </p>
            <Link 
              to="/register" 
              className="btn-primary px-8 py-4 text-lg rounded-full shadow-lg shadow-primary-600/20"
            >
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <Compass className="h-8 w-8 text-primary-500" />
              <span className="ml-2 text-xl font-bold text-white">PathFinder</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary-400 transition-colors">About</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Contact</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center">
            <p>&copy; {new Date().getFullYear()} PathFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;