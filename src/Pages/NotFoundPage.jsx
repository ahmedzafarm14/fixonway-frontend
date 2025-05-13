// src/Pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl mb-6">Page Not Found</p>
        <Link
          to="/"
          className="text-orange-400 hover:underline text-lg transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
