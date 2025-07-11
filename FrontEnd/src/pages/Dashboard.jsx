import React from 'react';
import { useRecoilValue } from 'recoil';
import Layout from '../components/Layout/Layout';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import EmployeeDashboard from '../components/Dashboard/EmployeeDashboard';
import { userRoleSelector } from '../store/authStore';

const Dashboard = () => {
  const userRole = useRecoilValue(userRoleSelector);

  return (
    <Layout>
      <div className="bg-gray-900 min-h-screen">
        {['admin', 'hr'].includes(userRole) ? (
          <AdminDashboard />
        ) : (
          <EmployeeDashboard />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;