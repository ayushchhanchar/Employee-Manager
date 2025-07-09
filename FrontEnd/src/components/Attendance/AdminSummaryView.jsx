import React, { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import { attendanceState } from '../../store/attendanceStore';
import { attendanceAPI } from '../../services/api';

const AdminSummaryView = () => {
  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [year, setYear] = useState(currentDate.getFullYear());
  const [attendance, setAttendance] = useRecoilState(attendanceState);

  const fetchSummary = async () => {
    setAttendance((prev) => ({ ...prev, loading: true }));
    try {
      const res = await attendanceAPI.getSummary({ month, year });
      setAttendance((prev) => ({
        ...prev,
        summary: res.data.data.summary,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      setAttendance((prev) => ({
        ...prev,
        summary: null,
        loading: false,
        error: 'Failed to load summary',
      }));
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [month, year]);

  const summary = attendance.summary;
  const loading = attendance.loading;

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      {/* Month-Year Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-600" />
          <select
            className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-indigo-500 focus:outline-none"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i + 1} value={i + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <input
          type="number"
          min="2000"
          max="2099"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="border border-gray-300 rounded px-3 py-2 shadow-sm focus:ring-indigo-500 focus:outline-none"
        />
        <button
          onClick={fetchSummary}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
        >
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <p className="text-gray-600">Loading summary...</p>
      ) : summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SummaryCard title="Present Days" value={summary.presentDays} color="green" />
          <SummaryCard title="Absent Days" value={summary.absentDays} color="red" />
          <SummaryCard title="Leaves" value={summary.leaves} color="yellow" />
          <SummaryCard title="Working Days" value={summary.totalDays} color="blue" />
          <SummaryCard title="Half Days" value={summary.halfDays} color="orange" />
          <SummaryCard title="Late Days" value={summary.lateDays} color="pink" />
          <SummaryCard title="Holidays" value={summary.holidays} color="gray" />
          <SummaryCard title="Total Hours" value={`${summary.totalHours} hrs`} color="indigo" />
        </div>
      ) : (
        <p className="text-gray-500">No attendance summary available.</p>
      )}
    </div>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, color }) => {
  const colorMap = {
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    orange: 'bg-orange-100 text-orange-800',
    pink: 'bg-pink-100 text-pink-800',
    gray: 'bg-gray-100 text-gray-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  };

  return (
    <div className={`p-4 rounded-md shadow ${colorMap[color]}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default AdminSummaryView;
