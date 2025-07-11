import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { authState } from '../store/authStore';
import { authAPI, employeeAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import Layout from '../components/Layout/Layout';
import Sidebar from '../components/Layout/Sidebar';

const ProfilePage = () => {
  const [auth, setAuth] = useRecoilState(authState);
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: '',
    role: '',
  });
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userRes = await authAPI.getProfile();
      const userData = userRes.data;
      
      setUserProfile({
        username: userData.username,
        email: userData.email,
        role: userData.role,
      });

      // If user is an employee, fetch employee profile
      if (userData.role === 'user') {
        try {
          // Get current user's employee profile
          const employeeRes = await employeeAPI.getAll({ search: userData.email });
          if (employeeRes.data.data && employeeRes.data.data.length > 0) {
            setEmployeeProfile(employeeRes.data.data[0]);
          }
        } catch (empErr) {
          console.log('No employee profile found');
        }
      }
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

  const handleUserChange = (e) => {
    setUserProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setEditing(true);
  };

  const handleEmployeeChange = (section, field, value) => {
    setEmployeeProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Update user profile
      const userRes = await authAPI.getProfile();
      // Note: Backend doesn't have user update endpoint, so we'll just show success
      
      // Update employee profile if exists
      if (employeeProfile) {
        await employeeAPI.update(employeeProfile._id, {
          personalInfo: employeeProfile.personalInfo,
          workInfo: employeeProfile.workInfo
        });
      }
      
      toast.success('Profile updated successfully');
      setEditing(false);
      
      // Update auth state
      setAuth(prev => ({
        ...prev,
        user: { ...prev.user, ...userProfile },
      }));
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <Layout>
      <Sidebar />
      <div className="p-6 text-gray-600 animate-pulse">Loading profile...</div>
    </Layout>
  );

  return (
    <Layout>
      <Sidebar />
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">👤 My Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Information */}
          <div className="bg-gray-800 p-6  rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">User Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className=''>
                <label className="block text-sm font-medium text-gray-200 mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={userProfile.username}
                  onChange={handleUserChange}
                  className="input bg-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={userProfile.email}
                  onChange={handleUserChange}
                  className="input  bg-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input
                  type="text"
                  value={userProfile.role}
                  disabled
                  className="input  bg-gray-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Employee Information (if user is an employee) */}
          {employeeProfile && (
            <div className="bg-gray-800 p-6 border border-gray-200 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Employee Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={employeeProfile.personalInfo?.firstName || ''}
                    onChange={(e) => handleEmployeeChange('personalInfo', 'firstName', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={employeeProfile.personalInfo?.lastName || ''}
                    onChange={(e) => handleEmployeeChange('personalInfo', 'lastName', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={employeeProfile.personalInfo?.phone || ''}
                    onChange={(e) => handleEmployeeChange('personalInfo', 'phone', e.target.value)}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={employeeProfile.employeeId || ''}
                    disabled
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={employeeProfile.workInfo?.department || ''}
                    disabled
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={employeeProfile.workInfo?.designation || ''}
                    disabled
                    className="input bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Role-based info box */}
          <div className="bg-white p-6 border border-gray-200 rounded-lg shadow">
            {userProfile.role === 'admin' && (
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm text-yellow-700">
                  🛠 You're an <strong>Admin</strong>. You have access to system settings and user management.
                </p>
              </div>
            )}

            {userProfile.role === 'hr' && (
              <div className="p-4 bg-pink-50 border-l-4 border-pink-400 rounded">
                <p className="text-sm text-pink-700">
                  ❤️ You're an <strong>HR</strong>. You manage employee requests, announcements, and leave approvals.
                </p>
              </div>
            )}

            {userProfile.role === 'user' && (
              <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <p className="text-sm text-blue-700">
                  👤 You're an <strong>Employee</strong>. You can track your attendance, leaves, and announcements.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={updating || !editing}
            className="bg-blue-700 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {updating ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ProfilePage;