import React from "react";
import { RecoilRoot } from "recoil";
import { Home } from "./Screens/Home";
import { Dashboard } from "./Screens/Dashboard";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import FixedComponent from './components/FixedComponent'
import Calender from "./Screens/Calender";
import TimeTracker from "./Screens/TimeTracker";
import Organization from "./Screens/Organization";
import Attendence from "./Screens/Attendence";
import Announcement from "./Screens/Announcement";
import NotFound from "./Screens/NotFound";
import Login from "./Screens/Login";
// import LeaveTracker from "./Screens/LeaveTracker";
import LeaveSummary from "./Screens/LeaveSummary";
import LeaveBalance from "./Screens/LeaveBalance";
import LeaveRequest from "./Screens/LeaveRequest";
import Holiday from "./Screens/Holiday";
import Register from "./Screens/Register";
import PrivateRoute from "./components/PrivateRoute";
import OAuthRedirect from "./Screens/OAuthRedirect";


function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
        <Routes>
          
            <Route path="/" element={<Login />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-redirect" element={<OAuthRedirect />} />

            <Route
            path="/home/myspace/Overview"
            element={<PrivateRoute element={Home} />}
          />
          <Route
            path="/home/myspace/Dashboard"
            element={<PrivateRoute element={Dashboard} />}
          />
          <Route
            path="/home/myspace/Calender"
            element={<PrivateRoute element={Calender} />}
          />
          <Route
            path="/home/Organization/Overview"
            element={<PrivateRoute element={Organization} />}
          />
          <Route
            path="/home/Organization/announcement"
            element={<PrivateRoute element={Announcement} />}
          />
          <Route
            path="/timetracker/mydata/timelogs"
            element={<PrivateRoute element={TimeTracker} />}
          />
          <Route
            path="/attendence/mydata/attendence Summary"
            element={<PrivateRoute element={Attendence} />}
          />
          <Route
            path="/trackLeave/holiday"
            element={<PrivateRoute element={Holiday} />}
          />
          <Route
            path="/trackLeave/mydata/leave summary"
            element={<PrivateRoute element={LeaveSummary} />}
          />
          <Route
            path="/trackLeave/mydata/leave balance"
            element={<PrivateRoute element={LeaveBalance} />}
          />
          <Route
            path="/trackLeave/mydata/leave Request"
            element={<PrivateRoute element={LeaveRequest} />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
