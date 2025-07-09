import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Spin } from 'antd';
import { authState } from '../../store/authStore';
import { authAPI } from '../../services/api';

const OAuthRedirect = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const response = await authAPI.getProfile();
        const user = response.data;
        
        localStorage.setItem('user', JSON.stringify(user));
        
        setAuth({
          isAuthenticated: true,
          user,
          token: null, // OAuth doesn't use JWT token
          loading: false,
          error: null
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('OAuth callback error:', error);
        navigate('/login');
      }
    };

    handleOAuthCallback();
  }, [navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spin size="large" />
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default OAuthRedirect;