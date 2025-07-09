import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../store/authStore';
import { authAPI } from '../services/api';

const AuthInitializer = () => {
  const [auth, setAuth] = useRecoilState(authState);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (token && user) {
        try {
          // Verify token is still valid
          const response = await authAPI.getProfile();
          setAuth({
            isAuthenticated: true,
            user: response.data,
            token,
            loading: false,
            error: null
          });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setAuth({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null
          });
        }
      } else {
        setAuth(prev => ({ ...prev, loading: false }));
      }
    };

    initializeAuth();
  }, [setAuth]);

  return null;
};

export default AuthInitializer;