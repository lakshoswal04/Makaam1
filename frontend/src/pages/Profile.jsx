import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaCheckCircle, FaUserGraduate, FaCogs, FaStar, FaWrench, FaArrowLeft } from 'react-icons/fa';

const Profile = () => {
  const { userProfile, isAuthenticated, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin');
    }
    if (userProfile) {
      setForm({ ...userProfile });
    }
  }, [isAuthenticated, loading, navigate, userProfile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await axios.put('/api/users/profile', form, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      setEditMode(false);
      setSuccess(true);
      refreshProfile && refreshProfile();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 pt-20 pb-10">
      <div className="container mx-auto px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl mb-6"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 mb-2"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl shadow-lg">
              <FaUser />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                {form.firstName} {form.lastName}
                {success && <FaCheckCircle className="text-green-400 animate-bounce" />}
              </h2>
              <p className="text-gray-400 flex items-center gap-2">
                <FaEnvelope className="inline-block" /> {form.email}
              </p>
            </div>
            <div className="ml-auto">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-purple-600/20 flex items-center gap-2"
                >
                  <FaEdit /> Edit
                </button>
              ) : null}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={form.firstName || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-60"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={form.lastName || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-60"
                  placeholder="Last Name"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email || ''}
                  disabled
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent opacity-60 cursor-not-allowed"
                  placeholder="Email"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaUserGraduate /> Education</label>
                <input
                  type="text"
                  name="educationLevel"
                  value={form.educationLevel || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-60"
                  placeholder="Your education (e.g. BSc Computer Science)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaCogs /> Skills / Interests</label>
                <input
                  type="text"
                  name="interests"
                  value={form.interests || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-60"
                  placeholder="Your interests (comma separated)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaWrench /> Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={form.skills || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-60"
                  placeholder="Your skills (comma separated)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaStar /> Goals</label>
                <input
                  type="text"
                  name="careerGoals"
                  value={form.careerGoals || ''}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-60"
                  placeholder="Your goals (e.g. Become a full-stack developer)"
                />
              </div>
            </div>
            {error && <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{error}</div>}
            {editMode && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <FaSave className="animate-pulse" /> Saving...
                  </>
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </motion.button>
            )}
            {!editMode && (
              <div className="text-center text-gray-400 mt-4">
                <span className="text-green-400 font-semibold">Profile up to date.</span>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
