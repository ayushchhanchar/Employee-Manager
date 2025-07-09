import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authAPI } from '../services/api';
import { authState } from '../store/authStore';

const Login = () => {
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.login(form);
      const token = res.data.token;
      localStorage.setItem('token', token);

      const { data: profile } = await authAPI.getProfile();
      localStorage.setItem('user', JSON.stringify(profile));

      setAuth({
        user: profile,
        token,
        isAuthenticated: true,
        loading: false,
        error: null
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn-blue w-full">Login</button>
        <p className="text-sm text-center">
          Don’t have an account? <a href="/register" className="text-blue-600">Register</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
