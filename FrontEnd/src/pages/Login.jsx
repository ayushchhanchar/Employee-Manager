import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authAPI } from '../services/api';
import { authState } from '../store/authStore';
import { EyeIcon, EyeSlashIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Login = () => {
  const setAuth = useSetRecoilState(authState);
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

      toast.success(`Welcome back, ${profile.username}!`);
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg mb-4 glow-blue">
            <ChartBarIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
          <p className="mt-1 text-sm text-gray-400">Sign in to your EMS Pro account</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 card-hover">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-md px-4 py-3">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="input"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="input pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 text-gray-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 border-gray-600 text-blue-600 focus:ring-blue-500 rounded bg-gray-700"
                />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Prompt */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-400 font-medium hover:underline">Register here</a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;