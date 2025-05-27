import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { doc, updateDoc, getFirestore } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass,
  BookOpen, 
  Code,
  Palette,
  Briefcase,
  PieChart,
  Lightbulb,
  GraduationCap,
  Award,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const db = getFirestore();

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    educationLevel: '',
    interests: [],
    skills: [],
    goals: ''
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const educationOptions = [
    { value: 'high_school', label: 'High School' },
    { value: 'college_student', label: 'College Student' },
    { value: 'graduate', label: 'Recent Graduate' },
    { value: 'professional', label: 'Working Professional' },
    { value: 'self_taught', label: 'Self-Taught Learner' }
  ];

  const interestOptions = [
    { value: 'web_development', label: 'Web Development', icon: <Code size={20} /> },
    { value: 'data_science', label: 'Data Science', icon: <PieChart size={20} /> },
    { value: 'design', label: 'Design', icon: <Palette size={20} /> },
    { value: 'product_management', label: 'Product Management', icon: <Briefcase size={20} /> },
    { value: 'ai_ml', label: 'AI & Machine Learning', icon: <Lightbulb size={20} /> },
    { value: 'mobile_development', label: 'Mobile Development', icon: <Code size={20} /> },
    { value: 'cybersecurity', label: 'Cybersecurity', icon: <Code size={20} /> },
    { value: 'digital_marketing', label: 'Digital Marketing', icon: <PieChart size={20} /> }
  ];

  const skillOptions = [
    { value: 'html_css', label: 'HTML & CSS' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'react', label: 'React' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'ui_design', label: 'UI Design' },
    { value: 'sql', label: 'SQL' },
    { value: 'git', label: 'Git' },
    { value: 'data_analysis', label: 'Data Analysis' },
    { value: 'project_management', label: 'Project Management' }
  ];

  const handleEducationSelect = (value) => {
    setFormData({ ...formData, educationLevel: value });
    setStep(2);
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const currentInterests = [...prev.interests];
      if (currentInterests.includes(interest)) {
        return { ...prev, interests: currentInterests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...currentInterests, interest] };
      }
    });
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => {
      const currentSkills = [...prev.skills];
      if (currentSkills.includes(skill)) {
        return { ...prev, skills: currentSkills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...currentSkills, skill] };
      }
    });
  };

  const handleGoalsChange = (e) => {
    setFormData({ ...formData, goals: e.target.value });
  };

  const handleSubmit = async () => {
    if (formData.interests.length === 0) {
      alert('Please select at least one interest');
      return;
    }

    try {
      setLoading(true);
      
      // Update user profile with onboarding data
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      alert('There was an error saving your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return !!formData.educationLevel;
    if (step === 2) return formData.interests.length > 0;
    if (step === 3) return true; // Skills are optional
    return !!formData.goals;
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Compass className="h-16 w-16 text-primary-500 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-white">Let's Personalize Your Journey</h1>
          <p className="mt-2 text-xl text-gray-400">We'll create a customized roadmap based on your profile</p>
        </div>

        <div className="glass-card p-8 relative">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Getting Started</span>
              <span className="text-gray-400">Step {step} of 4</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-500" 
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait" initial={false} custom={step}>
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">What's your education level?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {educationOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.educationLevel === option.value
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-gray-700 hover:border-primary-400 bg-gray-800/50'
                      }`}
                      onClick={() => handleEducationSelect(option.value)}
                    >
                      <div className="flex items-center">
                        <GraduationCap className={`h-6 w-6 ${
                          formData.educationLevel === option.value ? 'text-primary-400' : 'text-gray-400'
                        }`} />
                        <span className="ml-2 font-medium">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">What fields interest you?</h2>
                <p className="text-gray-400 mb-4">Select all that apply</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {interestOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.interests.includes(option.value)
                          ? 'border-primary-500 bg-primary-500/10'
                          : 'border-gray-700 hover:border-primary-400 bg-gray-800/50'
                      }`}
                      onClick={() => handleInterestToggle(option.value)}
                    >
                      <div className="flex items-center">
                        <span className={`mr-3 ${
                          formData.interests.includes(option.value) ? 'text-primary-400' : 'text-gray-400'
                        }`}>
                          {option.icon}
                        </span>
                        <span className="font-medium">{option.label}</span>
                        {formData.interests.includes(option.value) && (
                          <CheckCircle2 className="ml-auto h-5 w-5 text-primary-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={() => setStep(1)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="btn-primary"
                    disabled={!canProceed()}
                  >
                    Continue <ArrowRight className="ml-1 h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">What skills do you already have?</h2>
                <p className="text-gray-400 mb-4">Select all that apply (or none if you're just starting)</p>
                <div className="flex flex-wrap gap-3 mb-6">
                  {skillOptions.map((option) => (
                    <button
                      key={option.value}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        formData.skills.includes(option.value)
                          ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                          : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                      }`}
                      onClick={() => handleSkillToggle(option.value)}
                    >
                      {option.label}
                      {formData.skills.includes(option.value) && (
                        <CheckCircle2 className="ml-1 h-4 w-4 inline-block" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={() => setStep(2)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(4)}
                    className="btn-primary"
                  >
                    Continue <ArrowRight className="ml-1 h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={1}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white mb-6">What are your career goals?</h2>
                <p className="text-gray-400 mb-4">This helps us create a more relevant roadmap for you</p>
                <div className="mb-6">
                  <textarea
                    className="input-field h-32"
                    placeholder="I want to become a frontend developer with strong UI/UX skills..."
                    value={formData.goals}
                    onChange={handleGoalsChange}
                  ></textarea>
                </div>
                <div className="flex justify-between mt-8">
                  <button 
                    onClick={() => setStep(3)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="btn-primary"
                    disabled={loading || !formData.goals}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating your roadmap...
                      </span>
                    ) : (
                      <>
                        Complete <Award className="ml-1 h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;