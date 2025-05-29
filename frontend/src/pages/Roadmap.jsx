import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import AIRoadmap from '../components/AIRoadmap';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Roadmap = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen bg-dark-500 pt-20 pb-10">
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="bg-dark-400 rounded-lg shadow-lg p-6">
          <AIRoadmap userProfile={userProfile} />
        </div>
      </div>
    </div>
  );
};

export default Roadmap; 