import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { attendanceAPI } from '../../services/api';
import { toast } from 'react-hot-toast';

const EmployeeCalendarView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState({});
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMonthlyAttendance = async (date) => {
    setLoading(true);
    try {
      const res = await attendanceAPI.getSummary({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      });

      const attendanceArray = res.data.data.attendance || [];
      const map = {};
      attendanceArray.forEach((a) => {
        map[new Date(a.date).toDateString()] = a;
      });

      setAttendanceData(map);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      toast.error('Failed to fetch attendance data');
    }
    setLoading(false);
  };

  const fetchTodayAttendance = async () => {
    try {
      const res = await attendanceAPI.getToday();
      setTodayAttendance(res.data.data);
    } catch (err) {
      console.error('Error fetching today attendance:', err);
    }
  };

  useEffect(() => {
    fetchMonthlyAttendance(selectedDate);
    fetchTodayAttendance();
  }, []);

  const handleCheckIn = async () => {
    try {
      await attendanceAPI.checkIn({ location: 'Office' });
      toast.success('Checked in successfully!');
      fetchMonthlyAttendance(selectedDate);
      fetchTodayAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceAPI.checkOut({ location: 'Office' });
      toast.success('Checked out successfully!');
      fetchMonthlyAttendance(selectedDate);
      fetchTodayAttendance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
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
  const isToday = selectedKey === today.toDateString();

  return (
    <div className="space-y-6">
      {/* Today's Quick Actions */}
      {isToday && (
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Today's Attendance</h3>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Status: 
                <span className="font-bold ml-1">
                  {todayAttendance?.status || 'Not Marked'}
                </span>
              </p>
              {todayAttendance?.checkIn && (
                <p className="text-sm text-gray-600">
                  Check-in: {new Date(todayAttendance.checkIn).toLocaleTimeString()}
                </p>
              )}
              {todayAttendance?.checkOut && (
                <p className="text-sm text-gray-600">
                  Check-out: {new Date(todayAttendance.checkOut).toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckIn}
                disabled={!!todayAttendance?.checkIn}
              >
                {todayAttendance?.checkIn ? 'Checked In' : 'Check In'}
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCheckOut}
                disabled={!todayAttendance?.checkIn || !!todayAttendance?.checkOut}
              >
                {todayAttendance?.checkOut ? 'Checked Out' : 'Check Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance Calendar</h3>
        <Calendar
          onChange={(date) => setSelectedDate(date)}
          value={selectedDate}
          tileContent={tileContent}
          className="w-full"
        />
      </div>

      {/* Selected Date Details */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Attendance for {selectedDate.toDateString()}
        </h3>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : selectedAttendance ? (
          <div className="space-y-2">
            <p><span className="font-medium">Status:</span> {selectedAttendance.status}</p>
            {selectedAttendance.checkIn && (
              <p><span className="font-medium">Check-In:</span> {new Date(selectedAttendance.checkIn).toLocaleTimeString()}</p>
            )}
            {selectedAttendance.checkOut && (
              <p><span className="font-medium">Check-Out:</span> {new Date(selectedAttendance.checkOut).toLocaleTimeString()}</p>
            )}
            {selectedAttendance.totalHours && (
              <p><span className="font-medium">Total Hours:</span> {selectedAttendance.totalHours}</p>
            )}
            {selectedAttendance.notes && (
              <p><span className="font-medium">Notes:</span> {selectedAttendance.notes}</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No attendance record for this day.</p>
        )}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
            <span className="text-sm">Present</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
            <span className="text-sm">Absent</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
            <span className="text-sm">Leave</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className="text-sm">Half Day</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            <span className="text-sm">Holiday</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
            <span className="text-sm">Late</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCalendarView;