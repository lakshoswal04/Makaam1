import { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaSpinner, FaKey } from 'react-icons/fa'

const SignUp = () => {
  const { register, isAuthenticated, loading } = useAuth()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
    isAdmin: false
  })
  
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  // Redirect if already authenticated
  if (isAuthenticated && !loading) {
    return <Navigate to="/dashboard" />
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      })
    }
    // Clear API error when user types
    if (apiError) setApiError('')
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (validate()) {
      try {
        // Extract only the fields needed for registration
        // Check if the admin code is correct
        const isAdmin = formData.adminCode === 'ADMIN123';
        
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          isAdmin: isAdmin, // Set admin status based on code
          onboardingCompleted: isAdmin // Skip onboarding for admin users
        }
        
        console.log('Submitting registration data:', userData);
        await register(userData);
        // Show success message before redirecting
        setApiError('');
      } catch (err) {
        setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
        console.error('Registration error details:', err);
      }
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
          <FaUserPlus /> Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaUser /> First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="First Name"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaUser /> Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Last Name"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaEnvelope /> Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Email"
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
              placeholder="Password"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaLock /> Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Confirm Password"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2 flex items-center gap-2"><FaKey /> Admin Code <span className="text-xs text-gray-400">(Optional)</span></label>
            <input
              type="password"
              name="adminCode"
              value={formData.adminCode}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter admin code if you have one"
            />
            <p className="mt-1 text-xs text-gray-400">Leave blank for regular user account</p>
          </div>
          {apiError && (
            <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3">{apiError}</div>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" /> Signing Up...
              </>
            ) : (
              <>
                <FaUserPlus /> Sign Up
              </>
            )}
          </motion.button>
        </form>
        <div className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/signin" className="text-purple-400 hover:text-purple-300 transition-colors">Sign In</Link>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp