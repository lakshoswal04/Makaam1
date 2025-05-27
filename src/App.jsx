import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Loading from './components/common/Loading';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-loaded components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const Onboarding = lazy(() => import('./pages/onboarding/Onboarding'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const RoadmapView = lazy(() => import('./pages/roadmap/RoadmapView'));
const Resources = lazy(() => import('./pages/resources/Resources'));
const WeeklyCheckin = lazy(() => import('./pages/checkin/WeeklyCheckin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <Suspense fallback={<Loading fullScreen />}>
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap/:id" element={<RoadmapView />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/checkin" element={<WeeklyCheckin />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;