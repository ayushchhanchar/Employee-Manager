import React from "react";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";



function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
        <Routes>
          
            <Route path="/" element={<Dashboard />} />


            <Route
            path="/dashboard"
            element={<PrivateRoute element={Dashboard} />}
          />

        </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
