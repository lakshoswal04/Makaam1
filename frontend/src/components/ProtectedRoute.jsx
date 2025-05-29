import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const ProtectedRoute = ({ children, requireOnboarding = true }) => {
  const { isAuthenticated, loading, userProfile } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();
  const currentPath = location.pathname;

  useEffect(() => {
    // Show toast notification if user is not authenticated and tries to access a protected route
    if (!loading && !isAuthenticated) {
      showToast('Please sign in to access this page', 'info');
    }
  }, [isAuthenticated, loading, showToast]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-500">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location.pathname }} />;
  }

  // Check if user is an admin - redirect to admin dashboard instead of onboarding
  if (userProfile && userProfile.isAdmin && currentPath === '/') {
    return <Navigate to="/admin" />;
  }

  // Check if user has completed onboarding
  // Don't redirect if user is already on the onboarding page or if onboarding isn't required for this route
  // Skip onboarding for admin users
  if (requireOnboarding && 
      userProfile && 
      !userProfile.onboardingCompleted && 
      !userProfile.isAdmin && 
      currentPath !== '/onboarding') {
    return <Navigate to="/onboarding" />;
  }

  // Render children if authenticated and onboarding requirements are met
  return children;
};

export default ProtectedRoute;
