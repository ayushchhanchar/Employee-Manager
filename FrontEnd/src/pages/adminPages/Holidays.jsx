import React, { useEffect, useState } from 'react';
import { holidayAPI } from '../../services/api';
import Layout from '../../components/Layout/Layout';
import Sidebar from '../../components/Layout/Sidebar';
import { toast } from 'react-hot-toast';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: '',
    type: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [form, setForm] = useState({
    name: '',
    date: '',
    type: 'Company',
    description: '',
    isRecurring: false,
    applicableFor: 'All',
    department: '',
    location: ''
  });

  useEffect(() => {
    fetchHolidays();
  }, [filters]);

  const fetchHolidays = async () => {
    try {
      const res = await holidayAPI.getAll(filters);
      setHolidays(res.data.data || []);
    } catch (err) {
      toast.error('Failed to fetch holidays');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingHoliday) {
        await holidayAPI.update(editingHoliday._id, form);
        toast.success('Holiday updated successfully');
      } else {
        await holidayAPI.create(form);
        toast.success('Holiday created successfully');
      }
      setShowForm(false);
      setEditingHoliday(null);
      resetForm();
      fetchHolidays();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save holiday');
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      date: '',
      type: 'Company',
      description: '',
      isRecurring: false,
      applicableFor: 'All',
      department: '',
      location: ''
    });
  };

  const deleteHoliday = async (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        await holidayAPI.delete(id);
        fetchHolidays();
        toast.success('Holiday deleted successfully');
      } catch (err) {
        toast.error('Failed to delete holiday');
      }
    }
  };

  const editHoliday = (holiday) => {
    setEditingHoliday(holiday);
    setForm({
      name: holiday.name,
      date: holiday.date.split('T')[0],
      type: holiday.type,
      description: holiday.description || '',
      isRecurring: holiday.isRecurring,
      applicableFor: holiday.applicableFor,
      department: holiday.department || '',
      location: holiday.location || ''
    });
    setShowForm(true);
  };

  const getTypeColor = (type) => {
    const base = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (type) {
      case 'National': return `${base} text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-800/30`;
      case 'Regional': return `${base} text-orange-600 bg-orange-100 dark:text-orange-300 dark:bg-orange-700/30`;
      case 'Company': return `${base} text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-800/30`;
      case 'Optional': return `${base} text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700/30`;
      default: return `${base} text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700/30`;
    }
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const holidayDate = new Date(dateString);
    const diffTime = holidayDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 0) return 'Past';
    return `${diffDays} days`;
  };

  return (
    <Layout>
      <Sidebar />
      <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">🗓️ Holiday Calendar</h2>
          {(user?.role === 'admin' || user?.role === 'hr') && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Add Holiday
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <input
            type="number"
            name="year"
            value={filters.year}
            onChange={handleInputChange}
            className="border border-gray-700 bg-gray-800 text-white rounded-lg px-3 py-2"
            placeholder="Year"
          />
          <select
            name="type"
            onChange={handleInputChange}
            value={filters.type}
            className="border border-gray-700 bg-gray-800 text-white rounded-lg px-3 py-2"
          >
            <option value="">All Types</option>
            <option value="National">National</option>
            <option value="Regional">Regional</option>
            <option value="Company">Company</option>
            <option value="Optional">Optional</option>
          </select>
          <select
            name="month"
            onChange={handleInputChange}
            value={filters.month}
            className="border border-gray-700 bg-gray-800 text-white rounded-lg px-3 py-2"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option value={i + 1} key={i}>
                {new Date(0, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {/* Holiday List */}
        <div className="space-y-4">
          {holidays.map(holiday => (
            <div key={holiday._id} className="bg-gray-800 shadow rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{holiday.name}</h3>
                    <span className={getTypeColor(holiday.type)}>{holiday.type}</span>
                    {holiday.isRecurring && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-800/30 text-purple-300">
                        Recurring
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 mb-2">{new Date(holiday.date).toDateString()}</p>
                  {holiday.description && (
                    <p className="text-gray-200 mb-2">{holiday.description}</p>
                  )}
                  <div className="text-sm text-gray-400">
                    <p>Applicable for: {holiday.applicableFor}</p>
                    {holiday.department && <p>Department: {holiday.department}</p>}
                    {holiday.location && <p>Location: {holiday.location}</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm text-blue-400 font-medium">
                    {getDaysUntil(holiday.date)}
                  </span>
                  {(user?.role === 'admin' || user?.role === 'hr') && (
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded-md  hover:underline text-sm"
                        onClick={() => editHoliday(holiday)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-400 text-white px-3 py-1 rounded-md hover:underline text-sm"
                        onClick={() => deleteHoliday(holiday._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-gray-100 rounded-lg p-6 w-full max-w-2xl">
              <h3 className="text-lg font-semibold mb-4">
                {editingHoliday ? 'Edit Holiday' : 'Add Holiday'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block mb-1">Holiday Name</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Holiday Name"
                    value={form.name}
                    onChange={handleFormChange}
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block mb-1">Date</label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleFormChange}
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block mb-1">Type</label>
                    <select
                      id="type"
                      name="type"
                      value={form.type}
                      onChange={handleFormChange}
                      className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2"
                    >
                      <option value="National">National</option>
                      <option value="Regional">Regional</option>
                      <option value="Company">Company</option>
                      <option value="Optional">Optional</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="applicableFor" className="block mb-1">Applicable For</label>
                    <select
                      id="applicableFor"
                      name="applicableFor"
                      value={form.applicableFor}
                      onChange={handleFormChange}
                      className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2"
                    >
                      <option value="All">All</option>
                      <option value="Department">Department</option>
                      <option value="Location">Location</option>
                    </select>
                  </div>
                </div>

                {form.applicableFor === 'Department' && (
                  <div>
                    <label htmlFor="department" className="block mb-1">Department Name</label>
                    <input
                      id="department"
                      type="text"
                      name="department"
                      placeholder="Department Name"
                      value={form.department}
                      onChange={handleFormChange}
                      className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2"
                    />
                  </div>
                )}

                {form.applicableFor === 'Location' && (
                  <div>
                    <label htmlFor="location" className="block mb-1">Location</label>
                    <input
                      id="location"
                      type="text"
                      name="location"
                      placeholder="Location"
                      value={form.location}
                      onChange={handleFormChange}
                      className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="description" className="block mb-1">Description (optional)</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description (optional)"
                    value={form.description}
                    onChange={handleFormChange}
                    className="w-full border border-gray-600 bg-gray-700 text-white rounded-lg px-3 py-2 h-24"
                  />
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isRecurring"
                    checked={form.isRecurring}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  <span>Recurring Holiday</span>
                </label>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    {editingHoliday ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingHoliday(null);
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

export default Holidays;
