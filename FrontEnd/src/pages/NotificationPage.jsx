import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { notificationState, notificationFiltersState } from '../store/notificationStore';
import { notificationAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import Sidebar from '../components/Layout/Sidebar';

const NotificationPage = () => {
  const [notifications, setNotifications] = useRecoilState(notificationState);
  const [filters, setFilters] = useRecoilState(notificationFiltersState);
  const [pagination, setPagination] = useState({ current: 1, total: 1, hasNext: false, hasPrev: false });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationAPI.getAll({
        page: pagination.current,
        type: filters.type || undefined,
        priority: filters.priority || undefined,
        unreadOnly: filters.unreadOnly,
      });

      setNotifications(prev => ({
        ...prev,
        notifications: response.data.data,
        unreadCount: response.data.unreadCount
      }));

      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [filters, pagination.current]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationAPI.delete(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <Sidebar />
      <div className="p-6  dark:bg-gray-900 min-h-screen  dark:text-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Notifications</h1>
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Mark All as Read
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="border  dark:border-gray-600 bg-gray-800 dark:text-white rounded p-2"
          >
            <option value="">All Types</option>
            <option value="Leave">Leave</option>
            <option value="Announcement">Announcement</option>
            <option value="System">System</option>
            <option value="Reminder">Reminder</option>
          </select>

          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="border  dark:border-gray-600 bg-gray-800 dark:text-white rounded p-2"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <label className="flex items-center space-x-2 text-sm dark:text-white">
            <input
              type="checkbox"
              name="unreadOnly"
              checked={filters.unreadOnly}
              onChange={(e) => setFilters({ ...filters, unreadOnly: e.target.checked })}
              className="accent-blue-600"
            />
            <span>Unread Only</span>
          </label>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {loading ? (
            <p className=" text-gray-400">Loading notifications...</p>
          ) : notifications.notifications.length === 0 ? (
            <p className=" text-gray-400">No notifications found.</p>
          ) : (
            notifications.notifications.map((n) => (
              <div
                key={n._id}
                className={`border p-4 rounded shadow-sm ${
                  !n.isRead
                    ? ' dark:bg-blue-900/30'
                    : ' dark:bg-gray-800'
                } border-gray-200 dark:border-gray-700`}
              >
                <div className="flex justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{n.title}</h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{n.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                    <p className="text-xs mt-1">
                      <span className="mr-2">📌 {n.type}</span>
                      <span>⚠️ {n.priority}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(n._id)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => setPagination((prev) => ({ ...prev, current: prev.current - 1 }))}
            disabled={!pagination.hasPrev}
            className={`px-4 py-2 border rounded ${
              pagination.hasPrev
                ? ' dark:hover:bg-gray-700'
                : ' dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm dark:text-gray-300">
            Page {pagination.current} of {pagination.total}
          </span>
          <button
            onClick={() => setPagination((prev) => ({ ...prev, current: prev.current + 1 }))}
            disabled={!pagination.hasNext}
            className={`px-4 py-2 border rounded ${
              pagination.hasNext
                ? ' dark:hover:bg-gray-700'
                : ' dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default NotificationPage;
