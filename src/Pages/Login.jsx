import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Components/Loader"; // Import your Loader component
import ErrorAlert from "../Components/ErrorAlert";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      let user = response.data.user;
      sessionStorage.setItem("user", JSON.stringify(user));
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("isLoggedIn", true);
      sessionStorage.setItem("userId", user._id);
      if (user.role === "acquirer") {
        navigate("/acquirer");
      } else {
        navigate("/provider");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-silver flex items-center justify-center p-4">
      {loading && <Loader />}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full flex flex-col md:flex-row overflow-hidden border border-white/10">
        <div className="w-full md:w-1/2 p-10 text-white">
          <h2 className="text-3xl font-bold mb-6 text-silver">Welcome Back</h2>
          {error && error.length > 1 && <ErrorAlert error={error} />}
          {/* Show error if there is any */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-white">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email in state
                required
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-silver"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-white">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password in state
                required
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-silver"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 font-semibold transition duration-300 shadow-lg"
              disabled={loading} // Disable the button while loading
            >
              {loading ? "Loading..." : "Login"}{" "}
              {/* Change button text to 'Loading...' when making request */}
            </button>

            <p className="mt-4 text-sm text-center text-gray-300">
              Don't have an account?{" "}
              <Link to="/register" className="text-orange-400 hover:underline">
                Sign up
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

export default Login;
