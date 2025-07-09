import React, { useEffect, useState } from 'react';
import { announcementAPI } from '../../services/api';
import Layout from '../../components/Layout/Layout';
import Sidebar from '../../components/Layout/Sidebar';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [filters, setFilters] = useState({
    type: '',
    priority: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [filters]);

  const fetchAnnouncements = async () => {
    try {
      const res = await announcementAPI.getAll(filters);
      setAnnouncements(res.data.data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const markAsRead = async (id) => {
    try {
      await announcementAPI.markAsRead(id);
      fetchAnnouncements(); // Refresh to update readBy
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteAnnouncement = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await announcementAPI.delete(id);
        fetchAnnouncements();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <Layout>  
      <Sidebar  />
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Company Announcements</h2>

      {/* Filters for Admin/HR */}
      {(user?.role === 'admin' || user?.role === 'hr') && (
        <div className="flex gap-4 mb-4">
          <select
            name="type"
            value={filters.type}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">All Types</option>
            <option value="General">General</option>
            <option value="Important">Important</option>
            <option value="Urgent">Urgent</option>
            <option value="Holiday">Holiday</option>
            <option value="Event">Event</option>
          </select>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleInputChange}
            className="border p-2 rounded"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      )}

      <ul className="space-y-4">
        {announcements.map((ann) => (
          <li key={ann._id} className="p-4 bg-white rounded shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{ann.title}</h3>
                <p className="text-sm text-gray-700">{ann.content}</p>
                <p className="text-xs text-blue-600 mt-1">
                  {ann.type} | Priority: {ann.priority}
                </p>
              </div>
              <div className="text-sm space-x-2">
                {ann.readBy?.some(r => r.user === user?._id) ? (
                  <span className="text-green-600">Read</span>
                ) : (
                  <button
                    onClick={() => markAsRead(ann._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Mark as Read
                  </button>
                )}
                {(user?.role === 'admin' || user?.role === 'hr') && (
                  <>
                    <button className="text-yellow-600 hover:underline" onClick={() => alert('Edit UI not implemented')}>Edit</button>
                    <button className="text-red-500 hover:underline" onClick={() => deleteAnnouncement(ann._id)}>Delete</button>
                  </>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </Layout>
  );
};

export default Announcements;
