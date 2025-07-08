import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import {
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { authState } from '../../store/authStore';
import { attendanceAPI, leaveAPI, payrollAPI, employeeAPI } from '../../services/api';
import StatsCard from '../Common/StatsCard';
import QuickActions from '../Common/QuickActions';
import UpcomingEvents from '../Common/UpcomingEvents';

const EmployeeDashboard = () => {
  const auth = useRecoilValue(authState);
  const [dashboardData, setDashboardData] = useState({
    attendance: null,
    leaves: null,
    payroll: null,
    profile: null,
    loading: true
  });

  useEffect(() => {
    fetchEmployeeDashboardData();
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
      fetchEmployeeDashboardData(); // Refresh data
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceAPI.checkOut({ location: 'Office' });
      fetchEmployeeDashboardData(); // Refresh data
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
      color: dashboardData.attendance?.today?.status === 'Present' ? 'green' : 'red'
    },
    {
      title: 'This Month',
      value: `${dashboardData.attendance?.summary?.presentDays || 0} Days`,
      icon: ClockIcon,
      color: 'blue',
      subtitle: 'Present Days'
    },
    {
      title: 'Leave Balance',
      value: `${dashboardData.leaves?.leaveTypes?.Annual?.remaining || 0} Days`,
      icon: CalendarDaysIcon,
      color: 'yellow',
      subtitle: 'Annual Leave'
    },
    {
      title: 'This Month Salary',
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
      color: 'green'
    },
    {
      title: 'Check Out',
      description: 'End your work day',
      action: handleCheckOut,
      disabled: !dashboardData.attendance?.today?.checkIn || dashboardData.attendance?.today?.checkOut,
      color: 'red'
    },
    {
      title: 'Apply Leave',
      description: 'Submit a new leave request',
      link: '/leaves/apply',
      color: 'blue'
    },
    {
      title: 'View Payslip',
      description: 'Check your latest payslip',
      link: '/payroll',
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {auth.user?.username}!</h1>
            <p className="text-blue-100 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Current Time</p>
            <p className="text-xl font-semibold">
              {new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Quick Actions & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickActions actions={quickActions} />
        <UpcomingEvents />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {dashboardData.attendance?.today?.checkIn && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Checked in at {new Date(dashboardData.attendance.today.checkIn).toLocaleTimeString()}
                </span>
              </div>
            )}
            {dashboardData.attendance?.today?.checkOut && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">
                  Checked out at {new Date(dashboardData.attendance.today.checkOut).toLocaleTimeString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;