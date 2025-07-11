import React, { useEffect, useState } from 'react';
import { announcementAPI } from '../../services/api';
import Layout from '../../components/Layout/Layout';
import Sidebar from '../../components/Layout/Sidebar';
import { toast } from 'react-hot-toast';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [filters, setFilters] = useState({ type: '', priority: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    type: 'General',
    priority: 'Medium',
    targetAudience: 'All',
    department: '',
    expiryDate: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, [filters]);

  const fetchAnnouncements = async () => {
    try {
      const res = await announcementAPI.getAll(filters);
      setAnnouncements(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch announcements');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAnnouncement) {
        await announcementAPI.update(editingAnnouncement._id, form);
        toast.success('Announcement updated successfully');
      } else {
        await announcementAPI.create(form);
        toast.success('Announcement created successfully');
      }
      setShowForm(false);
      setEditingAnnouncement(null);
      resetForm();
      fetchAnnouncements();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save announcement');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      content: '',
      type: 'General',
      priority: 'Medium',
      targetAudience: 'All',
      department: '',
      expiryDate: ''
    });
  };

  const markAsRead = async (id) => {
    try {
      await announcementAPI.markAsRead(id);
      fetchAnnouncements();
      toast.success('Marked as read');
    } catch {
      toast.error('Failed to mark as read');
    }
  };

  const deleteAnnouncement = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await announcementAPI.delete(id);
        fetchAnnouncements();
        toast.success('Announcement deleted');
      } catch {
        toast.error('Failed to delete announcement');
      }
    }
  };

  const editAnnouncement = (ann) => {
    setEditingAnnouncement(ann);
    setForm({
      title: ann.title,
      content: ann.content,
      type: ann.type,
      priority: ann.priority,
      targetAudience: ann.targetAudience,
      department: ann.department || '',
      expiryDate: ann.expiryDate ? ann.expiryDate.split('T')[0] : ''
    });
    setShowForm(true);
  };

  const getPriorityColor = (priority) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (priority) {
      case 'High': return `${base} text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-800/30`;
      case 'Medium': return `${base} text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-700/30`;
      case 'Low': return `${base} text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-800/30`;
      default: return `${base} text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700/30`;
    }
  };

  const getTypeColor = (type) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (type) {
      case 'Urgent': return `${base} text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-800/30`;
      case 'Important': return `${base} text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-700/30`;
      case 'General': return `${base} text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-800/30`;
      case 'Holiday': return `${base} text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-800/30`;
      case 'Event': return `${base} text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-800/30`;
      default: return `${base} text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700/30`;
    }
  };

  return (
    <Layout>
      <Sidebar />
      <div className="p-6  dark:bg-gray-900 min-h-screen  dark:text-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">📢 Company Announcements</h2>
          {(user?.role === 'admin' || user?.role === 'hr') && (
            <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
              Create Announcement
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <select
            name="type"
            value={filters.type}
            onChange={handleInputChange}
            className="border border-gray-600  bg-gray-800 text-gray-100 rounded-lg px-3 py-2"
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
            className="border border-gray-600 bg-gray-800 text-gray-100 rounded-lg px-3 py-2"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann._id} className="border border-gray-600 bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{ann.title}</h3>
                    <span className={getTypeColor(ann.type)}>{ann.type}</span>
                    <span className={getPriorityColor(ann.priority)}>{ann.priority}</span>
                  </div>
                  <p className="text-gray-300 mb-3">{ann.content}</p>
                  <div className="text-sm text-gray-400">
                    <p>Target: {ann.targetAudience}</p>
                    {ann.department && <p>Department: {ann.department}</p>}
                    <p>Created: {new Date(ann.createdAt).toLocaleDateString()}</p>
                    {ann.expiryDate && <p>Expires: {new Date(ann.expiryDate).toLocaleDateString()}</p>}
                  </div>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {ann.readBy?.some(r => r.user === user?._id) ? (
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Read</span>
                  ) : (
                    <button onClick={() => markAsRead(ann._id)} className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                      Mark as Read
                    </button>
                  )}
                  {(user?.role === 'admin' || user?.role === 'hr') && (
                    <>
                      <button className="text-yellow-600 dark:text-yellow-400 text-sm hover:underline" onClick={() => editAnnouncement(ann)}>
                        Edit
                      </button>
                      <button className="text-red-500 dark:text-red-400 text-sm hover:underline" onClick={() => deleteAnnouncement(ann._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-gray-100 rounded-lg p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold mb-4">
                {editingAnnouncement ? 'Edit Announcement' : 'Create Announcement'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={form.title}
                  onChange={handleFormChange}
                  className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2"
                  required
                />
                <textarea
                  name="content"
                  placeholder="Content"
                  value={form.content}
                  onChange={handleFormChange}
                  className="w-full border border-gray-600 bg-gray-700 dark:text-white rounded-lg px-3 py-2 h-32"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="type"
                    value={form.type}
                    onChange={handleFormChange}
                    className="border border-gray-600 bg-gray-700 dark:text-white rounded-lg px-3 py-2"
                  >
                    <option value="General">General</option>
                    <option value="Important">Important</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Event">Event</option>
                  </select>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                    className="borderborder-gray-600 bg-gray-700 dark:text-white rounded-lg px-3 py-2"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="targetAudience"
                    value={form.targetAudience}
                    onChange={handleFormChange}
                    className="border border-gray-600 bg-gray-700 dark:text-white rounded-lg px-3 py-2"
                  >
                    <option value="All">All</option>
                    <option value="Employees">Employees</option>
                    <option value="Managers">Managers</option>
                    <option value="HR">HR</option>
                    <option value="Department">Department</option>
                  </select>
                  {form.targetAudience === 'Department' && (
                    <input
                      type="text"
                      name="department"
                      placeholder="Department Name"
                      value={form.department}
                      onChange={handleFormChange}
                      className="border border-gray-600 bg-gray-700 dark:text-white rounded-lg px-3 py-2"
                    />
                  )}
                </div>
                <input
                  type="date"
                  name="expiryDate"
                  value={form.expiryDate}
                  onChange={handleFormChange}
                  className="w-full border border-gray-600 bg-gray-700 dark:text-white rounded-lg px-3 py-2"
                />
                <div className="flex gap-4">
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    {editingAnnouncement ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAnnouncement(null);
                      resetForm();
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Announcements;
