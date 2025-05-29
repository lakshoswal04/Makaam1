import { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
import { decodeToken } from '../utils/jwtDecode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchUserProfile = async () => {
    try {
      const profileData = await userService.getProfile();
      console.log('AuthContext: User profile fetched:', profileData);
      
      // Handle both data structures - direct or nested in data property
      const userData = profileData.data || profileData;
      
      // Ensure we have a valid user profile object
      if (userData && (userData.firstName !== undefined || userData.lastName !== undefined)) {
        setUserProfile(userData);
        
        // Log onboarding status for debugging
        console.log('AuthContext: User onboarding status:', {
          onboardingCompleted: userData.onboardingCompleted,
          hasEducationLevel: !!userData.educationLevel,
          interestsCount: userData.interests?.length || 0
        });
        
        return userData;
      } else {
        console.error('AuthContext: Invalid user profile data structure:', userData);
        return null;
      }
    } catch (err) {
      console.error('AuthContext: Failed to fetch user profile:', err);
      return null;
    }
  };

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = authService.getCurrentUser();
    if (token) {
      // Decode token to check if user is admin
      const decodedToken = decodeToken(token);
      setIsAdmin(decodedToken?.isAdmin || false);
      setUser({ token });
      // Fetch user profile if token exists
      fetchUserProfile();
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      console.log('AuthContext: Logging in with credentials:', credentials);
      const response = await authService.login(credentials);
      console.log('AuthContext: Login successful:', response);
      
      // Store token in localStorage
      if (response.data) {
        localStorage.setItem('token', response.data);
        const token = response.data;
        // Decode token to check if user is admin
        const decodedToken = decodeToken(token);
        setIsAdmin(decodedToken?.isAdmin || false);
        setUser({ token });
        
        // Fetch user profile after successful login
        const profileData = await fetchUserProfile();
        if (profileData) {
          showToast('Welcome back! You have successfully signed in.', 'success', 5000);
        } else {
          showToast('Login successful, but unable to load profile. Please try again.', 'warning', 5000);
        }
      } else {
        throw new Error('No token received from server');
      }
      
      return response;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      showToast(errorMessage, 'error', 5000);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      console.log('AuthContext: Registering user with data:', userData);
      const response = await authService.register(userData);
      console.log('AuthContext: Registration successful:', response);
      
      // If this is an admin user, automatically log them in
      if (userData.isAdmin) {
        console.log('AuthContext: Admin user registered, performing automatic login');
        try {
          // Perform login with the same credentials
          const loginResponse = await authService.login({
            email: userData.email,
            password: userData.password
          });
          
          const token = loginResponse.data;
          // Decode token to check if user is admin
          const decodedToken = decodeToken(token);
          setIsAdmin(decodedToken?.isAdmin || false);
          setUser({ token });
          
          // Fetch user profile after successful login
          await fetchUserProfile();
          
          showToast('Admin account created! Redirecting to dashboard...', 'success', 5000);
          // Redirect to admin dashboard
          setTimeout(() => navigate('/admin'), 1000);
        } catch (loginError) {
          console.error('AuthContext: Auto-login after admin registration failed:', loginError);
          showToast('Account created! Please sign in.', 'success', 5000);
          setTimeout(() => navigate('/signin'), 1000);
        }
      } else {
        // For regular users, just show success message and redirect to sign in
        showToast('Registration successful! Please sign in.', 'success', 5000);
        // Delay navigation slightly to allow user to see the toast
        setTimeout(() => navigate('/signin'), 1000);
      }
      
      return response;
    } catch (error) {
      console.error('AuthContext: Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setUserProfile(null);
    setIsAdmin(false);
    showToast('You have been successfully signed out.', 'info', 5000);
    navigate('/signin');
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin,
    fetchUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
