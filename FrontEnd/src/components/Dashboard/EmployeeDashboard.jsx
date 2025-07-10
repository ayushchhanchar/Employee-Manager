import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import {
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  StopIcon,
  ChartBarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { authState } from '../../store/authStore';
import { attendanceAPI, leaveAPI, payrollAPI } from '../../services/api';
import StatsCard from '../Common/StatsCard';
import QuickActions from '../Common/QuickActions';
import UpcomingEvents from '../Common/UpcomingEvents';

const EmployeeDashboard = () => {
  const auth = useRecoilValue(authState);
  const [dashboardData, setDashboardData] = useState({
    attendance: null,
    leaves: null,
    payroll: null,
    loading: true
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchEmployeeDashboardData();
    
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const fetchEmployeeDashboardData = async () => {
    try {
      const [attendanceToday, attendanceSummary, leaveBalance, payrollSummary] = await Promise.all([
        attendanceAPI.getToday(),
        attendanceAPI.getSummary({ 
          month: new Date().getMonth() + 1, 
          year: new Date().getFullYear() 
        }),
        leaveAPI.getBalance(),
        payrollAPI.getSummary({ year: new Date().getFullYear() })
      ]);

      setDashboardData({
        attendance: {
          today: attendanceToday.data.data,
          summary: attendanceSummary.data.data.summary
        },
        leaves: leaveBalance.data.data,
        payroll: payrollSummary.data.data,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const handleCheckIn = async () => {
    try {
      await attendanceAPI.checkIn({ location: 'Office' });
      fetchEmployeeDashboardData();
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceAPI.checkOut({ location: 'Office' });
      fetchEmployeeDashboardData();
    } catch (error) {
      console.error('Check-out failed:', error);
    }
  };

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Today\'s Status',
      value: dashboardData.attendance?.today?.status || 'Not Marked',
      icon: dashboardData.attendance?.today?.status === 'Present' ? CheckCircleIcon : XCircleIcon,
      color: dashboardData.attendance?.today?.status === 'Present' ? 'green' : 'red',
      subtitle: dashboardData.attendance?.today?.checkIn 
        ? `Checked in at ${new Date(dashboardData.attendance.today.checkIn).toLocaleTimeString()}`
        : 'No check-in recorded'
    },
    {
      title: 'This Month',
      value: `${dashboardData.attendance?.summary?.presentDays || 0}`,
      icon: ClockIcon,
      color: 'blue',
      subtitle: 'Present Days',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Leave Balance',
      value: `${dashboardData.leaves?.leaveTypes?.Annual?.remaining || 0}`,
      icon: CalendarDaysIcon,
      color: 'yellow',
      subtitle: 'Annual Leave Days',
      change: '-2 days',
      changeType: 'decrease'
    },
    {
      title: 'Monthly Salary',
      value: `$${(dashboardData.payroll?.summary?.totalNetSalary / 12 || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'purple',
      subtitle: 'Net Salary'
    }
  ];

  const quickActions = [
    {
      title: 'Check In',
      description: 'Mark your attendance for today',
      action: handleCheckIn,
      disabled: dashboardData.attendance?.today?.checkIn,
      color: 'green',
      icon: PlayIcon
    },
    {
      title: 'Check Out',
      description: 'End your work day',
      action: handleCheckOut,
      disabled: !dashboardData.attendance?.today?.checkIn || dashboardData.attendance?.today?.checkOut,
      color: 'red',
      icon: StopIcon
    },
    {
      title: 'Apply Leave',
      description: 'Submit a new leave request',
      link: '/leaves',
      color: 'blue',
      icon: CalendarDaysIcon
    },
    {
      title: 'View Payslip',
      description: 'Check your latest payslip',
      link: '/payroll',
      color: 'purple',
      icon: CurrencyDollarIcon
    }
  ];

  return (
    <div className="space-y-6 fade-in pl-9">
      {/* Welcome Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {auth.user?.username}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="mt-4 flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm text-blue-100">Current Time</p>
                  <p className="text-xl font-semibold">
                    {currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
                {dashboardData.attendance?.today?.checkIn && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <p className="text-sm text-blue-100">Work Hours Today</p>
                    <p className="text-xl font-semibold">
                      {dashboardData.attendance.today.totalHours || 0}h
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                <TrophyIcon className="w-16 h-16 text-yellow-300" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <div key={index} className="card-hover">
            <StatsCard {...card} />
          </div>
        ))}
      </div>

      {/* Quick Actions & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-hover">
          <QuickActions actions={quickActions} />
        </div>
        <div className="card-hover">
          <UpcomingEvents />
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Overview */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Present Days</span>
              <span className="font-semibold text-green-600">
                {dashboardData.attendance?.summary?.presentDays || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Absent Days</span>
              <span className="font-semibold text-red-600">
                {dashboardData.attendance?.summary?.absentDays || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Leave Days</span>
              <span className="font-semibold text-yellow-600">
                {dashboardData.attendance?.summary?.leaves || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Hours</span>
              <span className="font-semibold text-blue-600">
                {dashboardData.attendance?.summary?.totalHours || 0}h
              </span>
            </div>
          </div>
        </div>

        {/* Leave Balance */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Leave Balance</h3>
            <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
          </div>
          {dashboardData.leaves?.leaveTypes && (
            <div className="space-y-4">
              {Object.entries(dashboardData.leaves.leaveTypes).map(([type, data]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{type}</span>
                  <div className="text-right">
                    <span className="font-semibold text-gray-900">{data.remaining}</span>
                    <span className="text-xs text-gray-500 ml-1">/ {data.total}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-elevated">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Today's Activity</h3>
          <ClockIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {dashboardData.attendance?.today?.checkIn ? (
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-green-800">Checked In</p>
                <p className="text-xs text-green-600">
                  {new Date(dashboardData.attendance.today.checkIn).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-600">Not Checked In</p>
                <p className="text-xs text-gray-500">Click check-in to start your day</p>
              </div>
            </div>
          )}
          
          {dashboardData.attendance?.today?.checkOut && (
            <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-red-800">Checked Out</p>
                <p className="text-xs text-red-600">
                  {new Date(dashboardData.attendance.today.checkOut).toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;