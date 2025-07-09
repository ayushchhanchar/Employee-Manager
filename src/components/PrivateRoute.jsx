import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../store/authStore';

const PrivateRoute = ({ children, roles = [] }) => {
  const auth = useRecoilValue(authState);

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (roles.length > 0 && !roles.includes(auth.user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;