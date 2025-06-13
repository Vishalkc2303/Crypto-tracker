import { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/userContext';

const ProtectedRoute = () => {
  const { isAuthenticated, validateAuth } = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await validateAuth(); // runs once
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div>Checking auth...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
