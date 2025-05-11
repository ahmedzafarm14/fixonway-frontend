import React from "react";
import { Link } from "react-router-dom";

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const role = prompt("Enter role: provider or acquirer").toLowerCase();
    if (role) {
      alert("Signup submitted (no backend)");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-silver flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full flex flex-col md:flex-row overflow-hidden border border-white/10">
        <div className="w-full md:w-1/2 p-10 text-white">
          <h2 className="text-3xl font-bold mb-6 text-silver">
            Create Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-white">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-white">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-white">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold transition duration-300 shadow-lg"
            >
              Sign Up
            </button>
            <p className="mt-4 text-sm text-center text-gray-300">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-400 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-500 text-white p-10 flex-col justify-center items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/854/854894.png"
            alt="car repair"
            className="w-32 h-32 mb-6 animate-bounce"
          />
          <h2 className="text-4xl font-bold mb-2">FixOnWay</h2>
          <p className="text-lg text-center text-gray-200">
            Stuck on the road? We connect you to nearby helpers, fast and easy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
