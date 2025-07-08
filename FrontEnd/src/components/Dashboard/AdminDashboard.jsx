import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {
  UsersIcon,
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline';
import { dashboardStatsState } from '../../store/authStore';
import { employeeAPI, attendanceAPI, leaveAPI, payrollAPI } from '../../services/api';
import StatsCard from '../Common/StatsCard';
import Chart from '../Common/Chart';
import RecentActivity from '../Common/RecentActivity';

const AdminDashboard = () => {
  const [stats, setStats] = useRecoilState(dashboardStatsState);
  const [attendanceData, setAttendanceData] = useState([]);
  const [leaveData, setLeaveData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setStats(prev => ({ ...prev, loading: true }));
    
    try {
      // Fetch all dashboard data
      const [employeeStats, attendanceStats, leaveStats, payrollStats] = await Promise.all([
        employeeAPI.getDashboardStats(),
        attendanceAPI.getSummary({ month: new Date().getMonth() + 1, year: new Date().getFullYear() }),
        leaveAPI.getStatistics({ year: new Date().getFullYear() }),
        payrollAPI.getSummary({ year: new Date().getFullYear() })
      ]);

      setStats({
        stats: {
          employees: employeeStats.data.data,
          attendance: attendanceStats.data.data.summary,
          leaves: leaveStats.data.data,
          payroll: payrollStats.data.data.summary
        },
        loading: false,
        error: null
      });

      // Set chart data
      setAttendanceData(generateAttendanceChartData(attendanceStats.data.data.attendance));
      setLeaveData(generateLeaveChartData(leaveStats.data.data.leaveTypeStats));

    } catch (error) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const generateAttendanceChartData = (attendance) => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAttendance = attendance.filter(a => 
        a.date.split('T')[0] === dateStr && a.status === 'Present'
      ).length;
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        present: dayAttendance
      });
    }
    return last7Days;
  };

  const generateLeaveChartData = (leaveStats) => {
    return leaveStats.map(stat => ({
      type: stat._id,
      count: stat.count,
      days: stat.totalDays
    }));
  };

  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Total Employees',
      value: stats.stats?.employees?.totalEmployees || 0,
      icon: UsersIcon,
      color: 'blue',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Present Today',
      value: stats.stats?.attendance?.presentDays || 0,
      icon: ClockIcon,
      color: 'green',
      change: '+5%',
      changeType: 'increase'
    },
    {
      title: 'Pending Leaves',
      value: stats.stats?.leaves?.statusStats?.find(s => s._id === 'Pending')?.count || 0,
      icon: CalendarDaysIcon,
      color: 'yellow',
      change: '-8%',
      changeType: 'decrease'
    },
    {
      title: 'Monthly Payroll',
      value: `$${(stats.stats?.payroll?.totalNetSalary || 0).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'purple',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at your company.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Attendance</h3>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <Chart
            type="line"
            data={attendanceData}
            xKey="date"
            yKey="present"
            color="#3B82F6"
          />
        </div>

        {/* Leave Types Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Leave Types Distribution</h3>
            <TrendingUpIcon className="w-5 h-5 text-gray-400" />
          </div>
          <Chart
            type="doughnut"
            data={leaveData}
            labelKey="type"
            valueKey="count"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
};

export default AdminDashboard;