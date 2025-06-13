import React, { useState } from 'react';
import { useAuth } from "../hooks/useAuth.jsx";
import { Login } from '../components/Auth/Login.jsx';
import { Register } from '../components/Auth/Register.jsx';
import { LoadingSpinner } from '../components/Common/LoadingSpinner.jsx';

// Main App Component (inside AuthProvider)
const AppContent = () => {
  const [currentView, setCurrentView] = useState('login');
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner message="Loading application..." />;
  }

  if (isLoggedIn) {
    return <Dashboard />;
  }

  return (
    <>
     
    </>
  );
}
export default AppContent