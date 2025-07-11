import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authAPI.register(form);
      alert('Registration successful! Please login.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            <UserPlusIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="mt-1 text-sm text-gray-400">Join EMS Pro as a user, HR, or admin</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 card-hover">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 text-sm rounded-md px-4 py-3">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={form.username}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
              </select>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          {/* Link to Login */}
          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/" className="text-blue-400 font-medium hover:underline">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;