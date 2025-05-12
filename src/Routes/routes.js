import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ChatUI from "../Pages/ChatUI.jsx";
import ServiceProviderDashboard from "../Pages/ServiceProviderDashboard.jsx";
import FixonwayLandingPage from "../Pages/FixonwayLandingPage.jsx";

const RouteLinks = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<FixonwayLandingPage />} />
          <Route
            path="/service-provider-dashboard"
            element={<ServiceProviderDashboard />}
          />
          <Route path="/chat" element={<ChatUI />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/dashboard" element={<div>Dashboard</div>} /> */}
        </Routes>
      </Router>
    </div>
  );
};

export default RouteLinks;
