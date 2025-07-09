import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../store/authStore';
import { userAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import classNames from 'classnames';
import Layout from '../components/Layout/Layout';
import Sidebar from '../components/Layout/Sidebar';

const ProfilePage = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    role: '',
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await userAPI.getProfile();
      const { username, email, phone, role } = res.data.data;
      setFormData({ username, email, phone, role });
    } catch (err) {
      console.error('Error fetching profile:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await userAPI.updateProfile(formData);
      toast.success('Profile updated successfully');
      setEditing(false);
      setAuth(prev => ({
        ...prev,
        user: res.data.data,
      }));
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-600 animate-pulse">Loading profile...</div>;

  return (
    <Layout>
        <Sidebar  />
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">👤 My Profile</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 border border-gray-200 rounded-lg shadow"
      >
        {/* Floating input field component */}
        {['username', 'email', 'phone'].map((field) => (
          <div key={field} className="relative">
            <input
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              id={field}
              value={formData[field]}
              onChange={handleChange}
              className={classNames(
                'peer block w-full px-3 pt-5 pb-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500',
                editing && 'bg-blue-50'
              )}
              placeholder=" "
              required
            />
            <label
              htmlFor={field}
              className="absolute text-sm text-gray-500 left-3 top-2 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
          </div>
        ))}

        {/* Role - disabled */}
        <div className="relative">
          <input
            name="role"
            value={formData.role}
            disabled
            className="block w-full px-3 pt-5 pb-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed"
            placeholder=" "
          />
          <label className="absolute text-sm text-gray-500 left-3 top-2">Role</label>
        </div>

        {/* Role-based info box */}
        {formData.role === 'admin' && (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <p className="text-sm text-yellow-700">
              🛠 You're an <strong>Admin</strong>. You have access to system settings and user management.
            </p>
          </div>
        )}

        {formData.role === 'hr' && (
          <div className="p-4 bg-pink-50 border-l-4 border-pink-400 rounded">
            <p className="text-sm text-pink-700">
              ❤️ You're an <strong>HR</strong>. You manage employee requests, announcements, and leave approvals.
            </p>
          </div>
        )}

        {formData.role === 'user' && (
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <p className="text-sm text-blue-700">
              👤 You're an <strong>Employee</strong>. You can track your attendance, leaves, and announcements.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={updating || !editing}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
        >
          {updating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
    </Layout>
  );
};

export default ProfilePage;
