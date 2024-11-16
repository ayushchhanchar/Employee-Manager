import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FcGoogle } from "react-icons/fc";
import { useRecoilState } from 'recoil';
import isSignUp from '../atom/IsSignup';
import isLoginAtom from '../atom/Islogin';

const LoginTest = () => {
  const [signUp, setSignUp] = useRecoilState(isSignUp);
  const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [username, setUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const navigate = useNavigate();

  const handleSignUpClick = () => {
    setSignUp(true);
  };

  const handleSignInClick = () => {
    setSignUp(false);
  };


  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email: loginEmail, password: loginPassword });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setIsLogin(true);
        navigate('/home/myspace/Overview');
      } else {
        // alert('Login failed: Invalid credentials');
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleGoogleLogin = () => {
    window.open(`http://localhost:5000/api/auth/google`, "_self");
  };


  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try{
    await axios.post('http://localhost:5000/api/auth/register', { username: username, email: registerEmail, password: registerPassword });
    alert('Registration successful!');
    navigate('/');
    setSignUp(false);
    setLoginEmail(registerEmail);
    setRegisterEmail('');
    setRegisterPassword('');
    setUsername('');
    }
    catch (error) {
      alert(error.response.data.message);
    }
  }


  return (
    <div
      className="flex flex-col justify-start items-center h-screen shadow-2xl"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1604856420566-576ba98b53cd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")', // replace with your image URL
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative w-full max-w-[100vh] min-h-[500px] rounded-lg shadow-lg bg-white bg-opacity-80 overflow-hidden mt-20">
        {/* Sign Up Form */}
        <div
          className={`absolute inset-y-0 left-0 w-1/2 h-fullbackdrop-blur-xl bg-blue-400/30 p-8 transition-transform duration-500 ease-in-out ${signUp ? 'translate-x-full opacity-100 pointer-events-auto' : '-translate-x-0 opacity-0 pointer-events-none'
            }`}
        >
          <h1 className="text-2xl font-bold mb-4 text-white">Create Account</h1>
          <form onSubmit={handleRegisterSubmit}>
            <div className="mb-4">
              <label className="block text-white text-md mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-md mb-2">Email</label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-md mb-2">Password</label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button type="submit" className="w-full rounded-full  bg-slate-400 hover:bg-slate-500 text-white py-2 px-4 mt-4">
              Register
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className={`absolute inset-y-0 left-0 w-1/2 h-fullbackdrop-blur-xl bg-slate-400/30 p-8 transition-transform duration-500 ease-in-out ${signUp ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100 pointer-events-auto'}`}>
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <p className="mb-4 text-white text-xl text-center">LOGIN</p>
              <label className="block text-white text-md mb-2">Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-md mb-2">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className='flex justify-between'>
              <button
                type="submit"
                className="w-full rounded-full bg-blue-500 hover:bg-blue-900 text-white py-2 px-4 mt-4"
              >
                Login
              </button>
            </div>
          </form>
          <div className='flex flex-col items-center justify-center mt-2 gap-2'>
            <h3>OR</h3>
            <button
              onClick={handleGoogleLogin}
              className="bg-white hover:bg-gray-100 text-black w-full py-2 px-4 rounded-[20px] focus:outline-none focus:shadow-outline flex items-center justify-center gap-2"
            >
              <FcGoogle /> Login with Google
            </button>
          </div>
        </div>

        {/* Overlay */}
        <div
          className={`absolute inset-y-0 left-1/2 w-1/2 h-fullbackdrop-blur-xl bg-gradient-to-r  from-slate-400/30 to-blue-400/30 text-white transition-transform duration-500 ease-in-out ${signUp ? '-translate-x-full' : 'translate-x-0'
            }`}
        >
          <div className="flex flex-col justify-center items-center h-full p-8">
            {/* Sign In Prompt */}
            {!signUp && (
              <div className="absolute top-0 flex flex-col justify-center items-center h-full w-full text-center">
                <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                <p className="mb-4">To keep connected with us, please login with your personal info.</p>
                <button
                  onClick={handleSignUpClick}
                  className="bg-transparent border border-white rounded-full py-2 px-5"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Sign Up Prompt */}
            {signUp && (
              <div className="absolute top-0 flex flex-col justify-center items-center h-full w-full text-center">
                <h1 className="text-3xl font-bold mb-2">Hello, Friend!</h1>
                <p className="mb-4">Enter your details and start your journey with us.</p>
                <button
                  onClick={handleSignInClick}
                  className="bg-transparent border border-white rounded-full py-2 px-5"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginTest;
