import React, { useState, useEffect } from "react";
import ChatUI from "./ChatUI";
import axios from "axios";
import { getCurrentLocation } from "../Utils/Utils.js";
import ErrorAlert from "../Components/ErrorAlert.jsx";
import SuccessAlert from "../Components/SuccessAlert";

const AcquirerDashboard = () => {
  const [currentView, setCurrentView] = useState("home");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [categories, setCategories] = useState([]);
  const [fetchedProviders, setFetchedProviders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleRequest = (e) => {
    e.preventDefault();
    setCurrentView("providers");
  };

  const handleProviderClick = (provider) => {
    setSelectedProvider(provider);
    setCurrentView("chat");
  };

  const handleNavClick = (view) => {
    setSelectedProvider(null);
    setCurrentView(view);
  };

  //Fetch Nearby Providers
  const onClickNearbyHandle = async (e) => {
    e.preventDefault();

    try {
      const location = await getCurrentLocation();
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/services/nearby`,
        {
          location: location,
          serviceType: e.target.value,
        }
      );
      console.log(response.data);
      setSuccessMessage("Near by Providers Fetched Successfully");
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      setFetchedProviders(response.data);
      setCurrentView("providers");
    } catch (error) {
      console.error("Error fetching nearby service providers:", error);
      setErrorMessage("Error fetching nearby service providers");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  // Fetch Catagories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}/api/service-types/get-service-types`
        );

        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Navbar */}
      <nav className="bg-gray-950/80 backdrop-blur-sm p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-400">FixOnWay</h1>
          <ul className="flex gap-6 text-gray-300">
            <li
              className="hover:text-orange-400 cursor-pointer"
              onClick={() => handleNavClick("home")}
            >
              Home
            </li>
            <li
              className="hover:text-orange-400 cursor-pointer"
              onClick={() => handleNavClick("chat")}
            >
              Chat
            </li>
          </ul>
        </div>
      </nav>
      {errorMessage && errorMessage.length > 1 && (
        <ErrorAlert error={errorMessage} />
      )}
      {successMessage && successMessage.length > 1 && (
        <SuccessAlert success={successMessage} />
      )}

      {/* Home / Service Request Form */}
      {currentView === "home" && (
        <div className="max-w-3xl mx-auto mt-10 p-8 bg-white/5 rounded-2xl shadow-2xl border border-white/10 text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/854/854894.png"
            alt="Help Icon"
            className="w-20 h-20 mx-auto animate-bounce"
          />
          <h2 className="text-3xl font-bold mt-4">Do You Need Help?</h2>
          <p className="text-gray-300 mt-2">
            Tell us your issue and we'll show nearby service providers.
          </p>

          <form className="mt-6 text-left space-y-4" onSubmit={handleRequest}>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Select Service Type
              </label>
              <select
                className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500"
                defaultValue=""
              >
                <option value="" disabled>
                  Select a service
                </option>
                {categories.map((category, index) => (
                  <option key={index} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              onClick={onClickNearbyHandle}
              className="w-full bg-orange-500 py-3 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Show Nearby Providers
            </button>
          </form>
        </div>
      )}

      {/* Providers View */}
      {currentView === "providers" && (
        <div className="max-w-5xl mx-auto mt-20 px-6">
          <h3 className="text-2xl font-bold mb-6">Nearby Service Providers</h3>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
            {fetchedProviders.map((provider, i) => (
              <div
                key={i}
                className="bg-gray-800/70 p-6 rounded-xl shadow hover:shadow-orange-500/30 border border-white/10 transition hover:scale-105 cursor-pointer"
                onClick={() => handleProviderClick(provider)}
              >
                <h4 className="text-xl font-bold text-orange-400">
                  {provider.fullName}
                </h4>
                <p className="text-gray-300 mt-2">
                  {Number(provider.distanceInKM.toFixed(1))} KM away
                </p>
                <button className="mt-4 w-full bg-orange-600 hover:bg-orange-700 py-2 rounded-lg transition font-semibold">
                  Start Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat View */}
      {currentView === "chat" && (
        <div className="max-w-5xl mx-auto">
          {selectedProvider ? (
            <ChatUI user={selectedProvider} />
          ) : (
            <ChatUI user={null} />
          )}
        </div>
      )}
    </div>
  );
};

export default AcquirerDashboard;
