import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { authState } from '../store/authStore';

const PublicRoute = ({ children }) => {
  const auth = useRecoilValue(authState);

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return auth.isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;