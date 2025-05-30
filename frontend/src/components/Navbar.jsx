import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import { FaUser, FaChevronDown, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Navbar = () => {
  const { isAuthenticated, logout, userProfile, isAdmin } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu-container')) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-dark-500/90 backdrop-blur-md py-3 shadow-lg' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link to="/" className="flex items-center">
            <Logo className="h-9 w-auto" />
          </Link>
          
          <div className="hidden md:flex ml-10 space-x-8">
            {isAuthenticated && (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/roadmap">Roadmap</NavLink>
                <NavLink to="/weekly-checkin">Weekly Check-in</NavLink>
                <NavLink to="/resources">Resource Library</NavLink>
                {isAdmin && (
                  <NavLink to="/admin">Admin Dashboard</NavLink>
                )}
              </>
            )}
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isAuthenticated ? (
            <div className="relative profile-menu-container">
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 py-2 px-3 rounded-lg transition-all duration-200 backdrop-blur-sm"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  {userProfile?.firstName ? (
                    <span className="text-sm font-bold">
                      {userProfile.firstName.charAt(0)}{userProfile.lastName ? userProfile.lastName.charAt(0) : ''}
                    </span>
                  ) : (
                    <FaUser size={14} />
                  )}
                </div>
                <span className="hidden md:inline text-white">
                  {userProfile?.firstName ? userProfile.firstName : 'Profile'}
                </span>
                <FaChevronDown size={12} className={`text-white transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-xl shadow-xl py-1 z-50 border border-white/10"
                  >
                    <ProfileMenuItem to="/dashboard">Dashboard</ProfileMenuItem>
                    <ProfileMenuItem to="/roadmap">Roadmap</ProfileMenuItem>
                    <ProfileMenuItem to="/weekly-checkin">Weekly Check-in</ProfileMenuItem>
                    <ProfileMenuItem to="/resources">Resource Library</ProfileMenuItem>
                    {isAdmin && (
                      <ProfileMenuItem to="/admin">Admin Dashboard</ProfileMenuItem>
                    )}
                    <ProfileMenuItem to="/profile">My Profile</ProfileMenuItem>
                    <div className="border-t border-white/10 my-1"></div>
                    <button 
                      onClick={() => { logout(); navigate('/'); }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors"
                    >
                      <FaSignOutAlt className="mr-2" />
                      Sign out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/signin" className="bg-transparent border border-purple-600 text-purple-500 hover:bg-purple-600/10 py-2 px-4 rounded-lg transition-all duration-200 font-medium">
                Log in
              </Link>
              <Link to="/signup" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-200 font-medium shadow-lg shadow-purple-600/20">
                Sign up
              </Link>
            </>
          )}
        </motion.div>
      </div>
    </motion.nav>
  )
}

const NavLink = ({ to, children }) => (
  <Link 
    to={to} 
    className="text-gray-300 hover:text-purple-500 transition-colors duration-200 relative group"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-200 group-hover:w-full"></span>
  </Link>
)

const ProfileMenuItem = ({ to, children }) => (
  <Link 
    to={to} 
    className="flex items-center px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
  >
    {children}
  </Link>
)

export default Navbar