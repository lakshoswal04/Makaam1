import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'
import { FaUser, FaChevronDown } from 'react-icons/fa'

const Navbar = () => {
  const { isAuthenticated, logout, userProfile } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

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

  // Close profile menu when clicking outside
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark-500/90 backdrop-blur-md py-3 shadow-md' : 'bg-dark-500 py-3'
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <Logo className="h-9 w-auto" />
          </Link>
          
          <div className="hidden md:flex ml-10 space-x-8">
            <a href="#features" className="text-gray-300 hover:text-purple-500 transition-colors duration-200">Features</a>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative profile-menu-container">
              <button 
                onClick={toggleProfileMenu}
                className="flex items-center gap-2 bg-dark-400 hover:bg-dark-300 py-2 px-3 rounded-md transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                  {userProfile?.firstName ? (
                    <span className="text-sm font-bold">
                      {userProfile.firstName.charAt(0)}{userProfile.lastName ? userProfile.lastName.charAt(0) : ''}
                    </span>
                  ) : (
                    <FaUser size={14} />
                  )}
                </div>
                <span className="hidden md:inline">
                  {userProfile?.firstName ? userProfile.firstName : 'Profile'}
                </span>
                <FaChevronDown size={12} className={`transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-400 rounded-md shadow-lg py-1 z-50 border border-dark-300">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-dark-300">
                    My Profile
                  </Link>
                  <div className="border-t border-dark-300 my-1"></div>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-dark-300"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signin" className="bg-transparent border border-purple-600 text-purple-500 hover:bg-purple-600/10 py-2 px-4 rounded-md transition-all duration-200 font-medium">
                Log in
              </Link>
              <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-all duration-200 font-medium">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar