import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AIRoadmap from '../components/AIRoadmap'
import { motion } from 'framer-motion'
import { FaArrowLeft } from 'react-icons/fa'

const Roadmap = () => {
  const { userProfile, isAuthenticated, loading } = useAuth()
  const navigate = useNavigate()
  const [hasGeneratedRoadmap, setHasGeneratedRoadmap] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin')
    }
  }, [isAuthenticated, loading, navigate])

  useEffect(() => {
    if (userProfile?.roadmap) {
      setHasGeneratedRoadmap(true)
    }
  }, [userProfile])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 pt-20 pb-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Your Learning Roadmap</h1>
          <p className="text-gray-300 mb-8">
            {hasGeneratedRoadmap
              ? 'Your personalized learning path is ready. Follow these steps to achieve your goals.'
              : 'Complete your profile to generate a personalized learning roadmap tailored to your goals.'}
          </p>
          <AIRoadmap userProfile={userProfile} showActions={true} />
        </motion.div>
      </div>
    </div>
  )
}

export default Roadmap 