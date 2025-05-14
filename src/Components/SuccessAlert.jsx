import React from "react";

const SuccessAlert = ({ success }) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg shadow-md text-center fixed top-0 left-1/2 transform -translate-x-1/2 z-50">
      {success}
    </div>
  );
};

export default SuccessAlert;
