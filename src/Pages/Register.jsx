import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorAlert from "../Components/ErrorAlert";
import SuccessAlert from "../Components/SuccessAlert";
import Loader from "../Components/Loader";
import axios from "axios";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Automatically clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const locationData = {
              type: "Point",
              coordinates: [longitude, latitude],
            };
            resolve(locationData); // Resolve with location data
          },
          (err) => {
            reject("Error getting location: " + err.message); // Reject with error message
          }
        );
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  };

  // Automatically clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const locationData = await getCurrentLocation(); // Wait for the location

      const { name, email, role, password } = formData;
      const formSubmissionData = {
        name,
        email,
        role,
        password,
        location: locationData || {
          type: "Point",
          coordinates: [0, 0],
        }, // Use the fetched location or default to [0, 0]
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/signup`,
        formSubmissionData
      );

      setSuccess(response.data.message);
      setError("");
      setLoading(false);
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          role: "",
          password: "",
        });
        navigate("/login");
      }, 2000);
    } catch (err) {
      // console.error("Error during registration:", err.message);
      setError(err.response.data.message || "An error occurred");
      setSuccess("");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-silver flex items-center justify-center p-4">
      {loading && <Loader />}
      <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow-2xl max-w-6xl w-full flex flex-col md:flex-row overflow-hidden border border-white/10">
        <div className="w-full md:w-1/2 p-10 text-white">
          <h2 className="text-3xl font-bold mb-6 text-silver">
            Create Account
          </h2>
          {error && <ErrorAlert error={error} />}
          {success && <SuccessAlert success={success} />}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-white">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-white">
                I am a...
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="" disabled>
                  -- Select a role --
                </option>
                <option value="provider">Provider</option>
                <option value="acquirer">Acquirer</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
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
