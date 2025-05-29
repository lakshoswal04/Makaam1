import { useState } from 'react'
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import { useAuth } from '../context/AuthContext'

const SignIn = () => {
  const { login, isAuthenticated, loading, error } = useAuth()
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
  if (isAuthenticated && !loading) {
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
    e.preventDefault()
    try {
      console.log('Submitting login data:', {
        email: formData.email,
        password: formData.password
      });
      await login({
        email: formData.email,
        password: formData.password
      });
      setFormError('');
      // Navigate to the dashboard after login
      navigate(from);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      console.error('Login error details:', err);
    }
  }

  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Don't have an account?" 
      linkText="Create a new account" 
      linkUrl="/signup"
    >
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
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="input-field pl-10"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="input-field pl-10"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-primary-600 bg-dark-300 border-dark-400 rounded focus:ring-primary-500 focus:border-primary-500"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link to="#" className="text-primary-500 hover:text-primary-400">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="w-full btn-primary py-3 text-base font-medium"
          >
            Sign in
          </button>
        </div>


      </form>
    </AuthLayout>
  )
}

export default SignIn