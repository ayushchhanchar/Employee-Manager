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
        presentEmployees: res.data.data.presentEmployees,
        loading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to fetch summary:', error);
      setAttendance((prev) => ({
        ...prev,
        summary: null,
        presentEmployees: [],
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
  const presentEmployees = attendance.presentEmployees || [];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="text-gray-100">
      {/* Month-Year Selector */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-gray-300" />
          <select
            className="input w-auto bg-gray-800 border border-gray-700"
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i + 1} value={i + 1} className="bg-gray-800 text-gray-100">
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
          className="input w-28 bg-gray-800 border border-gray-700"
        />
        <button onClick={fetchSummary} className="btn-primary">
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      {loading ? (
        <p className="text-gray-400">Loading summary...</p>
      ) : summary ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <SummaryCard title="Present Days" value={summary.presentDays} color="green" />
            <SummaryCard title="Absent Days" value={summary.absentDays} color="red" />
            <SummaryCard title="Leaves" value={summary.leaves} color="yellow" />
            <SummaryCard title="Working Days" value={summary.totalDays} color="blue" />
            <SummaryCard title="Half Days" value={summary.halfDays} color="orange" />
            <SummaryCard title="Late Days" value={summary.lateDays} color="pink" />
            <SummaryCard title="Holidays" value={summary.holidays} color="gray" />
            <SummaryCard title="Total Hours" value={`${summary.totalHours} hrs`} color="indigo" />
          </div>

          {/* Present Employee List */}
          <div className="bg-gray-800 border border-gray-700 rounded p-4">
            <h2 className="text-lg font-semibold mb-4">Present Employees</h2>
            {presentEmployees.length === 0 ? (
              <p className="text-gray-400">No employees marked as present this month.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-300 border-b border-gray-600">
                      <th className="py-2 px-4">Name</th>
                      <th className="py-2 px-4">Check-In</th>
                      <th className="py-2 px-4">Check-Out</th>
                    </tr>
                  </thead>
                  <tbody>
                    {presentEmployees.map((emp) => (
                      <tr key={emp._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="py-2 px-4">{emp.name}</td>
                        <td className="py-2 px-4">
                          {emp.checkIn ? new Date(emp.checkIn).toLocaleTimeString() : '—'}
                        </td>
                        <td className="py-2 px-4">
                          {emp.checkOut ? new Date(emp.checkOut).toLocaleTimeString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No attendance summary available.</p>
      )}
    </div>
  );
};

const SummaryCard = ({ title, value, color }) => {
  const colorMap = {
    green: 'bg-green-900/50 text-green-300 border border-green-700',
    red: 'bg-red-900/50 text-red-300 border border-red-700',
    yellow: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
    blue: 'bg-blue-900/50 text-blue-300 border border-blue-700',
    orange: 'bg-orange-900/50 text-orange-300 border border-orange-700',
    pink: 'bg-pink-900/50 text-pink-300 border border-pink-700',
    gray: 'bg-gray-700/50 text-gray-300 border border-gray-600',
    indigo: 'bg-indigo-900/50 text-indigo-300 border border-indigo-700',
  };

  return (
    <div className={`card ${colorMap[color]} hover:shadow-xl transition-all`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
};

export default AdminSummaryView;
