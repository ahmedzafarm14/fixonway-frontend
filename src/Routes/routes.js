import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import FixonwayLandingPage from "../Pages/FixonwayLandingPage";
import FixonwayDashboard from "../Pages/ProviderDashboard";
import ProtectedRoute from "./ProtectedRoutes.jsx";
import PublicOnlyRoute from "./PublicOnlyRoutes.jsx";
import NotFound from "../Pages/NotFoundPage";

const RouteLinks = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<FixonwayLandingPage />} />
        <Route path="*" element={<NotFound />} />

        {/* Auth-only routes */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute requiredRole="provider">
              <FixonwayDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/acquirer"
          element={
            <ProtectedRoute requiredRole="acquirer">
              <div>Acquirer Dashboard</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default RouteLinks;
