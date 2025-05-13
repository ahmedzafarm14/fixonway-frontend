import React from "react";

const ErrorAlert = ({ error }) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg shadow-md text-center">
      {error}
    </div>
  );
};

export default ErrorAlert;
