import React, { useEffect, useState } from 'react';
import { holidayAPI } from '../../services/api';
import Layout from '../../components/Layout/Layout';
import Sidebar from '../../components/Layout/Sidebar';

const Holidays = () => {
  const [holidays, setHolidays] = useState([]);
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    month: '',
    type: ''
  });

  useEffect(() => {
    fetchHolidays();
  }, [filters]);

  const fetchHolidays = () => {
    holidayAPI.getAll(filters).then(res => {
      setHolidays(res.data.data || []);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const deleteHoliday = async (id) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      await holidayAPI.delete(id);
      fetchHolidays();
    }
  };

  return (
    <Layout>
      <Sidebar />
    <div className="p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Holiday Calendar</h2>

      {/* Filters for Admin/HR */}
      {(user.role === 'admin' || user.role === 'hr') && (
        <div className="mb-4 flex flex-wrap gap-3">
          <select
            name="type"
            onChange={handleInputChange}
            value={filters.type}
            className="border p-2 rounded"
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
            className="border p-2 rounded"
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option value={i + 1} key={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
        </div>
      )}

      {/* Holiday List */}
      <ul className="space-y-3">
        {holidays.map(holiday => (
          <li key={holiday._id} className="bg-white shadow p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold text-lg">{holiday.name}</p>
              <p className="text-gray-500">{new Date(holiday.date).toDateString()}</p>
              <p className="text-sm text-blue-600">{holiday.type}</p>
            </div>

            {/* Show buttons for Admin/HR only */}
            {(user.role === 'admin' || user.role === 'hr') && (
              <div className="space-x-2">
                <button className="text-blue-600 hover:underline" onClick={() => alert('Edit UI not implemented')}>Edit</button>
                <button className="text-red-500 hover:underline" onClick={() => deleteHoliday(holiday._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
    </Layout>
  );
};

export default Holidays;
