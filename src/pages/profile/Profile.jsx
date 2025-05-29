import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Key, 
  Save,
  GraduationCap,
  Code,
  Palette,
  Briefcase,
  PieChart,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import Loading from '../../components/common/Loading';

const db = getFirestore();

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    educationLevel: '',
    interests: [],
    skills: [],
    goals: ''
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { currentUser } = useAuth();

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (currentUser) {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            setFormData({
              educationLevel: userData.educationLevel || '',
              interests: userData.interests || [],
              skills: userData.skills || [],
              goals: userData.goals || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleEducationSelect = (value) => {
    setFormData({ ...formData, educationLevel: value });
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    // This would typically be handled by Firebase Auth
    // For this demo, we'll just show a success message
    setSuccessMessage('Password updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProfileUpdate = async () => {
    if (formData.interests.length === 0) {
      setErrorMessage('Please select at least one interest');
      return;
    }

    try {
      setSaving(true);
      
      // Update user profile with onboarding data
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>
        
        <div className="glass-card overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button 
              className={`px-6 py-4 font-medium text-sm ${activeTab === 'account' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('account')}
            >
              Account
            </button>
            <button 
              className={`px-6 py-4 font-medium text-sm ${activeTab === 'preferences' ? 'text-primary-400 border-b-2 border-primary-500' : 'text-gray-400 hover:text-gray-300'}`}
              onClick={() => setActiveTab('preferences')}
            >
              Learning Preferences
            </button>
          </div>
          
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="bg-green-900/30 border border-green-800 text-green-400 px-4 py-3 mx-6 mt-6 rounded">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 mx-6 mt-6 rounded">
              {errorMessage}
            </div>
          )}
          
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="p-6">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                    <div className="flex items-center p-3 bg-gray-800/50 rounded border border-gray-700">
                      <User className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-white">{userData?.displayName || 'Not set'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                    <div className="flex items-center p-3 bg-gray-800/50 rounded border border-gray-700">
                      <Mail className="h-5 w-5 text-gray-500 mr-2" />
                      <span className="text-white">{currentUser?.email || 'Not set'}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="max-w-md">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="password"
                        className="input-field pl-10"
                        placeholder="Enter your current password"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="password"
                        className="input-field pl-10"
                        placeholder="Enter your new password"
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="password"
                        className="input-field pl-10"
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary">
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}
          
          {/* Learning Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-6">Learning Preferences</h2>
              <p className="text-gray-400 mb-6">Update your learning preferences to get a more personalized experience.</p>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-3">Education Level</h3>
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
                      type="button"
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
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-3">Interests</h3>
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
                      type="button"
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
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-3">Skills</h3>
                <p className="text-gray-400 mb-4">Select all that apply</p>
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
                      type="button"
                    >
                      {option.label}
                      {formData.skills.includes(option.value) && (
                        <CheckCircle2 className="ml-1 h-4 w-4 inline-block" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium text-white mb-3">Career Goals</h3>
                <p className="text-gray-400 mb-4">Describe your career goals</p>
                <textarea
                  className="input-field h-32 w-full"
                  placeholder="I want to become a frontend developer with strong UI/UX skills..."
                  value={formData.goals}
                  onChange={handleGoalsChange}
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button 
                  className="btn-primary flex items-center"
                  onClick={handleProfileUpdate}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
