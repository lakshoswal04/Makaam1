import { useState } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'
import { motion } from 'framer-motion'
import { FaUser, FaLock, FaSignInAlt, FaSpinner } from 'react-icons/fa'

const SignIn = () => {
  const { login, isAuthenticated, loading: authLoading, error } = useAuth()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [formError, setFormError] = useState('')
  
  // Get the page the user was trying to access
  const from = '/dashboard';

  // Redirect if already authenticated
  if (isAuthenticated && !authLoading) {
    return <Navigate to={from} />
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    // Clear error when user types
    if (formError) setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);
    try {
      await login({ email: formData.email, password: formData.password });
      setFormError('');
      navigate(from);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error details:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
          <FaSignInAlt /> Sign In
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {formError && (
            <div className="p-4 bg-red-500 bg-opacity-10 border border-red-500 rounded-md mb-4 animate-pulse">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-500">Authentication Error</h3>
                  <div className="mt-1 text-sm text-red-400">
                    {formError}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>
            <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaUser /> Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaLock /> Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Signing In...
              </>
            ) : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </motion.button>
        </form>
        <div className="text-center text-gray-400 mt-6">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:text-purple-300 transition-colors">Sign Up</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default SignIn