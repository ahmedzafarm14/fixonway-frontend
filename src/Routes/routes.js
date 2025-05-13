import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import FixonwayDashboard from "../Pages/ProviderDashboard.jsx";
import FixonwayLandingPage from "../Pages/FixonwayLandingPage.jsx";

const RouteLinks = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<FixonwayLandingPage />} />
          <Route path="/provider" element={<FixonwayDashboard />} />
          <Route path="/acquirer" element={<div>Acquirer Dashboard</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/dashboard" element={<div>Dashboard</div>} /> */}
        </Routes>
      </Router>
    </div>
  );
};

export default RouteLinks;
