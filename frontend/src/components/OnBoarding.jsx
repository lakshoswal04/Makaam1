import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { userService } from '../services/api';
import { useToast } from '../context/ToastContext';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaStar, FaCogs, FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa';

const educationLevels = [
  'High School',
  'Some College',
  'Associate Degree',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate',
  'Other'
];

const interestAreas = [
  'Software Development',
  'Data Science',
  'Artificial Intelligence',
  'Cybersecurity',
  'Cloud Computing',
  'UI/UX Design',
  'Digital Marketing',
  'Business Analytics',
  'Project Management',
  'Other'
];

const OnBoarding = () => {
  const navigate = useNavigate();
  const { fetchUserProfile } = useAuth();
  const { showToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    educationLevel: '',
    interests: [],
    skills: '',
    careerGoals: ''
  });

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!formData.educationLevel) {
          showToast('Please select your education level', 'error');
          return false;
        }
        break;
      case 2:
        if (formData.interests.length === 0) {
          showToast('Please select at least one interest', 'error');
          return false;
        }
        break;
      case 3:
        if (!formData.skills.trim()) {
          showToast('Please enter your skills', 'error');
          return false;
        }
        break;
      case 4:
        if (!formData.careerGoals.trim()) {
          showToast('Please enter your career goals', 'error');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    try {
      setIsSubmitting(true);
      // Use the correct endpoint for updating profile
      const response = await api.put('/users/profile', {
        ...formData,
        onboardingCompleted: true
      });
      
      console.log('Onboarding complete response:', response.data);
      await fetchUserProfile();
      showToast('Profile updated successfully!', 'success');
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 pt-20 pb-10 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            {step === 1 && <FaGraduationCap className="text-purple-400" />} 
            {step === 2 && <FaCogs className="text-purple-400" />} 
            {step === 3 && <FaCogs className="text-purple-400" />} 
            {step === 4 && <FaStar className="text-purple-400" />} 
            Complete Your Profile
          </h1>
          <div className="text-sm text-gray-400">
            Step {step} of 4
          </div>
        </div>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2"><FaGraduationCap /> What is your education level?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {educationLevels.map((level) => (
                <button
                  key={level}
                  className={`p-3 rounded-lg border transition-all duration-200 text-white font-medium ${formData.educationLevel === level ? 'border-purple-500 bg-purple-600/20 shadow-lg scale-105' : 'border-white/10 hover:border-purple-500/50 bg-white/5'}`}
                  onClick={() => setFormData(prev => ({ ...prev, educationLevel: level }))}
                  type="button"
                >
                  {level}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2"><FaCogs /> Select your areas of interest</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interestAreas.map((interest) => (
                <button
                  key={interest}
                  className={`p-3 rounded-lg border transition-all duration-200 text-white font-medium ${formData.interests.includes(interest) ? 'border-purple-500 bg-purple-600/20 shadow-lg scale-105' : 'border-white/10 hover:border-purple-500/50 bg-white/5'}`}
                  onClick={() => handleInterestToggle(interest)}
                  type="button"
                >
                  {interest}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2"><FaCogs /> What skills do you currently have?</h2>
            <textarea
              className="w-full bg-white/10 border border-white/10 rounded-lg p-4 min-h-[120px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="List your technical and soft skills..."
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
            />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2"><FaStar /> What are your career goals?</h2>
            <textarea
              className="w-full bg-white/10 border border-white/10 rounded-lg p-4 min-h-[120px] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Describe your short-term and long-term career goals..."
              value={formData.careerGoals}
              onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
            />
          </motion.div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBack}
              disabled={isSubmitting}
              className="px-6 py-2 border border-white/10 rounded-lg bg-white/5 text-white hover:bg-purple-600/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <FaArrowLeft /> Back
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={step < 4 ? handleNext : handleSubmit}
            disabled={isSubmitting}
            className="ml-auto px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg shadow-purple-600/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <FaCheck className="animate-spin" /> Submitting...
              </>
            ) : step < 4 ? (
              <>
                Next <FaArrowRight />
              </>
            ) : (
              <>
                <FaCheck /> Finish
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OnBoarding;
