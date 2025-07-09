// src/components/Attendance/EmployeeCalendarView.jsx
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { attendanceAPI } from '../../services/api';

const EmployeeCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchMonthlyAttendance = async (date) => {
    setLoading(true);
    try {
      const res = await attendanceAPI.getSummary({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });

      const attendanceArray = res.data.data.attendance;
      const map = {};
      attendanceArray.forEach((a) => {
        map[new Date(a.date).toDateString()] = a;
      });

      setAttendanceData(map);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMonthlyAttendance(selectedDate);
  }, []);

  const handleCheckIn = async () => {
    try {
      await attendanceAPI.checkIn({ location: 'Office' });
      fetchMonthlyAttendance(selectedDate);
    } catch (err) {
      alert('Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceAPI.checkOut({ location: 'Office' });
      fetchMonthlyAttendance(selectedDate);
    } catch (err) {
      alert('Check-out failed');
    }
  };

  const tileContent = ({ date }) => {
    const key = date.toDateString();
    const status = attendanceData[key]?.status;

    if (!status) return null;

    const colorMap = {
      Present: 'text-green-600',
      Absent: 'text-red-600',
      Leave: 'text-yellow-600',
      'Half Day': 'text-orange-500',
      Holiday: 'text-gray-500',
      Late: 'text-pink-500',
    };

    return (
      <p className={`text-xs font-semibold ${colorMap[status] || 'text-gray-400'}`}>
        {status}
      </p>
    );
  };

  const today = new Date();
  const selectedKey = selectedDate.toDateString();
  const selectedAttendance = attendanceData[selectedKey];

  return (
    <div>
      <Calendar
        onChange={(date) => setSelectedDate(date)}
        value={selectedDate}
        tileContent={tileContent}
      />

      <div className="mt-6 bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Attendance for {selectedDate.toDateString()}
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <>
            {selectedKey === today.toDateString() ? (
              <>
                <p className="mb-2">
                  Status: <span className="font-bold">{selectedAttendance?.status || 'Not Marked'}</span>
                </p>
                <div className="flex gap-4">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={handleCheckIn}
                    disabled={!!selectedAttendance?.checkIn}
                  >
                    Check In
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={handleCheckOut}
                    disabled={!selectedAttendance?.checkIn || !!selectedAttendance?.checkOut}
                  >
                    Check Out
                  </button>
                </div>
              </>
            ) : selectedAttendance ? (
              <>
                <p>Status: {selectedAttendance.status}</p>
                {selectedAttendance.checkIn && (
                  <p>Check-In: {new Date(selectedAttendance.checkIn).toLocaleTimeString()}</p>
                )}
                {selectedAttendance.checkOut && (
                  <p>Check-Out: {new Date(selectedAttendance.checkOut).toLocaleTimeString()}</p>
                )}
              </>
            ) : (
              <p>No attendance record for this day.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EmployeeCalendarView;
