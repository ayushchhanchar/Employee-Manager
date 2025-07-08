import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import isLoginAtom from '../atom/Islogin';
import { useRecoilState } from 'recoil';


const OAuthRedirect = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useRecoilState(isLoginAtom)


  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', { withCredentials: true });
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
          setIsLogin(true)
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/'); // Redirect to login if fetching profile fails
      }
    };

    getUserProfile();
  }, [navigate]);

  return <div>Redirecting...</div>;
};

export default OAuthRedirect;
