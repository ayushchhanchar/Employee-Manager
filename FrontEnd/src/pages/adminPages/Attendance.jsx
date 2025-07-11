import React from 'react';
import { useRecoilValue } from 'recoil';
import { userRoleSelector } from '../../store/authStore';
import Layout from '../../components/Layout/Layout';
import Sidebar from '../../components/Layout/Sidebar';
import AdminSummaryView from '../../components/Attendance/AdminSummaryView';    
import EmployeeCalendarView from '../../components/Attendance/EmployeeCalendarView';

const Attendance = () => {
  const role = useRecoilValue(userRoleSelector);

  return (
    <Layout>
      <Sidebar />
      <div className="px-6 py-6 bg-gray-900 min-h-screen text-gray-100">
        <h2 className="text-3xl font-bold mb-6">🗓️ Attendance</h2>
        {role === 'admin' || role === 'hr' ? (
          <AdminSummaryView />
        ) : (
          <EmployeeCalendarView />
        )}
      </div>
    </Layout>
  );
};

export default Attendance;
