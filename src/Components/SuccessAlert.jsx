import React from "react";

const SuccessAlert = ({ success }) => {
  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-green-100 border border-green-300 text-green-800 rounded-lg shadow-md text-center">
      {success}
    </div>
  );
};

export default SuccessAlert;
