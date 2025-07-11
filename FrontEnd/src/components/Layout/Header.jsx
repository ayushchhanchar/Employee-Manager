import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router-dom';
import {
  BellIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { CollapsedAtom } from '../../atom/Collapsed';
import { authState } from '../../store/authStore';
import { notificationState } from '../../store/notificationStore';
import { notificationAPI } from '../../services/api';

const Header = () => {
  const isCollapsed = useRecoilValue(CollapsedAtom);
  const [auth, setAuth] = useRecoilState(authState);
  const [notifications, setNotifications] = useRecoilState(notificationState);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    fetchNotifications();

    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setNotifications(prev => ({
        ...prev,
        unreadCount: response.data.data.unreadCount
      }));
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll({ limit: 5 });
      setNotifications(prev => ({
        ...prev,
        notifications: response.data.data || []
      }));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsReadAndNavigate = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationAPI.markAsRead(notification._id);
        fetchUnreadCount();
        fetchNotifications();
      }

      if (notification.type === 'Announcement') {
        navigate(`/announcements`);
      } else if (notification.type === 'Leave') {
        navigate(`/leaves`);
      } else {
        navigate('/notifications');
      }
      setShowNotifications(false);
    } catch (err) {
      console.error('Error handling notification click:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
    navigate('/');
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <header className={`
      fixed top-0 right-0 h-16 bg-gray-800/80 backdrop-blur-md border-b border-gray-700 z-40 transition-all duration-300
      ${isCollapsed ? 'left-20' : 'left-72'}
    `}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Section - Search & Time */}
        <div className="flex items-center space-x-6">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-100 placeholder-gray-400"
            />
          </div>

          {/* Time & Date */}
          <div className="hidden lg:block">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-100">{getCurrentTime()}</p>
              <p className="text-xs text-gray-400">{getCurrentDate()}</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="relative p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <BellIcon className="w-6 h-6" />
              {notifications.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {notifications.unreadCount > 9 ? '9+' : notifications.unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 py-2 z-50 max-h-96 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-100">Notifications</h3>
                    {notifications.unreadCount > 0 && (
                      <span className="badge-info">{notifications.unreadCount} new</span>
                    )}
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.notifications.length > 0 ? (
                    notifications.notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => markAsReadAndNavigate(notification)}
                        className={`px-4 py-3 hover:bg-gray-700 cursor-pointer border-l-4 transition-colors ${
                          !notification.isRead ? 'bg-blue-900/20 border-l-blue-500' : 'border-l-transparent'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            !notification.isRead ? 'bg-blue-500' : 'bg-gray-500'
                          }`}></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-100">{notification.title}</p>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <BellIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">No notifications</p>
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 border-t border-gray-700">
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setShowNotifications(false);
                    }}
                    className="w-full text-sm text-blue-400 hover:text-blue-300 font-medium"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <button className="p-2 text-gray-400 hover:text-gray-100 hover:bg-gray-700 rounded-lg transition-colors">
            <Cog6ToothIcon className="w-6 h-6" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {auth.user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-100">{auth.user?.username}</p>
                <p className="text-xs text-gray-400 capitalize">{auth.user?.role}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm font-medium text-gray-100">{auth.user?.username}</p>
                  <p className="text-xs text-gray-400">{auth.user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                >
                  <UserCircleIcon className="w-4 h-4 mr-3" />
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowProfileMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                >
                  <Cog6ToothIcon className="w-4 h-4 mr-3" />
                  Preferences
                </button>
                <hr className="my-2 border-gray-700" />
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;