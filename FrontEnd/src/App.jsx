import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Screens/Login";
import PrivateRoute from "./components/PrivateRoute";
import OAuthRedirect from "./Screens/OAuthRedirect";
import Dashboard from "./pages/Dashboard";
import NotFound from "./Screens/NotFound";


function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
        <Routes>
          
            <Route path="/" element={<Login />} />
            <Route path="/oauth-redirect" element={<OAuthRedirect />} />

            <Route
            path="/dashboard"
            element={<PrivateRoute element={Dashboard} />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
