import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Employees from "./pages/adminPages/Employees";
import Attendance from "./pages/adminPages/Attendance";
import Leaves from "./pages/adminPages/Leaves";
import Payroll from "./pages/adminPages/Payroll";
import Announcements from "./pages/adminPages/Announcements"; 
import Holidays from "./pages/adminPages/Holidays";
import NotificationPage from "./pages/NotificationPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                theme: {
                  primary: 'green',
                  secondary: 'black',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={Dashboard} />}
            />
            <Route path="/employees" element={<PrivateRoute element={Employees} />} />
            <Route path="/attendance" element={<PrivateRoute element={Attendance} />} />
            <Route path="/leaves" element={<PrivateRoute element={Leaves} />} />
            <Route path="/payroll" element={<PrivateRoute element={Payroll} />} />
            <Route path="/announcements" element={<PrivateRoute element={Announcements} />} />
            <Route path="/holidays" element={<PrivateRoute element={Holidays} />} />
            <Route path="/notifications" element={<PrivateRoute element={NotificationPage} />} />
            <Route path="/profile" element={<PrivateRoute element={ProfilePage} />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;