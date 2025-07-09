import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { ConfigProvider } from 'antd';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import AuthInitializer from './components/AuthInitializer';

// Auth Pages
import Login from './pages/auth/Login';
import OAuthRedirect from './pages/auth/OAuthRedirect';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeProfile from './pages/employees/EmployeeProfile';
import Attendance from './pages/attendance/Attendance';
import AttendanceList from './pages/attendance/AttendanceList';
import LeaveList from './pages/leaves/LeaveList';
import LeaveApplication from './pages/leaves/LeaveApplication';
import PayrollList from './pages/payroll/PayrollList';
import AnnouncementList from './pages/announcements/AnnouncementList';
import HolidayList from './pages/holidays/HolidayList';
import NotificationList from './pages/notifications/NotificationList';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

// Error Pages
import NotFound from './pages/NotFound';

const antdTheme = {
  token: {
    colorPrimary: '#3B82F6',
    borderRadius: 8,
  },
};

function App() {
  return (
    <RecoilRoot>
      <ConfigProvider theme={antdTheme}>
        <Router>
          <AuthInitializer />
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/oauth-redirect" element={<OAuthRedirect />} />
            
            {/* Private Routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
            
            {/* Employee Management */}
            <Route path="/employees" element={<PrivateRoute roles={['admin', 'hr']}><EmployeeList /></PrivateRoute>} />
            <Route path="/employees/:id" element={<PrivateRoute><EmployeeProfile /></PrivateRoute>} />
            
            {/* Attendance */}
            <Route path="/attendance" element={<PrivateRoute><Attendance /></PrivateRoute>} />
            <Route path="/attendance/list" element={<PrivateRoute roles={['admin', 'hr']}><AttendanceList /></PrivateRoute>} />
            
            {/* Leave Management */}
            <Route path="/leaves" element={<PrivateRoute><LeaveList /></PrivateRoute>} />
            <Route path="/leaves/apply" element={<PrivateRoute><LeaveApplication /></PrivateRoute>} />
            
            {/* Payroll */}
            <Route path="/payroll" element={<PrivateRoute><PayrollList /></PrivateRoute>} />
            
            {/* Announcements */}
            <Route path="/announcements" element={<PrivateRoute><AnnouncementList /></PrivateRoute>} />
            
            {/* Holidays */}
            <Route path="/holidays" element={<PrivateRoute><HolidayList /></PrivateRoute>} />
            
            {/* Notifications */}
            <Route path="/notifications" element={<PrivateRoute><NotificationList /></PrivateRoute>} />
            
            {/* Default Routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ConfigProvider>
    </RecoilRoot>
  );
}

export default App;