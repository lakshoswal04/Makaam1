import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { userService } from '../services/api';
import { useToast } from '../context/ToastContext';

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
    <div className="min-h-screen bg-dark-500 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-dark-400 rounded-lg shadow-lg p-6 md:p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Complete Your Profile</h1>
            <div className="text-sm text-gray-400">
              Step {step} of 4
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">What is your education level?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {educationLevels.map((level) => (
                  <button
                    key={level}
                    className={`p-3 rounded-md border ${formData.educationLevel === level ? 'border-purple-500 bg-purple-500/10' : 'border-dark-300 hover:border-purple-500/50'}`}
                    onClick={() => setFormData(prev => ({ ...prev, educationLevel: level }))}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Select your areas of interest</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interestAreas.map((interest) => (
                  <button
                    key={interest}
                    className={`p-3 rounded-md border ${formData.interests.includes(interest) ? 'border-purple-500 bg-purple-500/10' : 'border-dark-300 hover:border-purple-500/50'}`}
                    onClick={() => handleInterestToggle(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">What skills do you currently have?</h2>
              <textarea
                className="w-full bg-dark-300 border border-dark-200 rounded-md p-3 min-h-[150px]"
                placeholder="List your technical and soft skills..."
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">What are your career goals?</h2>
              <textarea
                className="w-full bg-dark-300 border border-dark-200 rounded-md p-3 min-h-[150px]"
                placeholder="Describe your short-term and long-term career goals..."
                value={formData.careerGoals}
                onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
              />
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-6 py-2 border border-dark-300 rounded-md hover:bg-dark-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
            )}
            <button
              onClick={step < 4 ? handleNext : handleSubmit}
              disabled={isSubmitting}
              className="ml-auto px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && step === 4 ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                step < 4 ? 'Next' : 'Complete'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoarding;
