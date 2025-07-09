import React from 'react';
import { useRecoilValue } from 'recoil';
import Layout from '../components/Layout/Layout';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import EmployeeDashboard from '../components/Dashboard/EmployeeDashboard';
import { userRoleSelector } from '../store/authStore';
import Sidebar from '../components/Layout/Sidebar';

const Dashboard = () => {
  const userRole = useRecoilValue(userRoleSelector);

  return (
    <Layout>
      <Sidebar />
      {['admin', 'hr'].includes(userRole) ? (
        <AdminDashboard />
      ) : (
        <EmployeeDashboard />
      )}
    </Layout>
  );
};

export default Dashboard;