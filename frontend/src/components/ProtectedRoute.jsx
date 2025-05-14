import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

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

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
