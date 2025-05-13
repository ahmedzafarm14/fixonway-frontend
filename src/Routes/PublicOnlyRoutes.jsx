// src/Components/PublicOnlyRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PublicOnlyRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
  const user = JSON.parse(sessionStorage.getItem("user") || "{}");

  if (isLoggedIn) {
    if (user.role === "provider") return <Navigate to="/provider" replace />;
    if (user.role === "acquirer") return <Navigate to="/acquirer" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicOnlyRoute;
