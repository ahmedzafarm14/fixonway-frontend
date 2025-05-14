import React, { useState } from "react";
import ChatUI from "./ChatUI";

const AcquirerDashboard = () => {
  const [currentView, setCurrentView] = useState("home"); // 'home' | 'providers' | 'chat'
  const [selectedProvider, setSelectedProvider] = useState(null);

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
              <select className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-orange-500">
                <option>Bike Puncture</option>
                <option>No Fuel</option>
                <option>Engine Failure</option>
                <option>Battery Issue</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">
                Describe Your Issue
              </label>
              <textarea
                rows="4"
                className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-orange-500"
                placeholder="Describe your issue briefly..."
              ></textarea>
            </div>

            <button
              type="submit"
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
            {["Raza Mechanic", "Zeeshan Auto", "FastFix", "SpeedWrench"].map(
              (provider, i) => (
                <div
                  key={i}
                  className="bg-gray-800/70 p-6 rounded-xl shadow hover:shadow-orange-500/30 border border-white/10 transition hover:scale-105 cursor-pointer"
                  onClick={() => handleProviderClick(provider)}
                >
                  <h4 className="text-xl font-bold text-orange-400">
                    {provider}
                  </h4>
                  <p className="text-gray-300 mt-2">
                    2.4 km away • Opens till 10 PM
                  </p>
                  <button className="mt-4 w-full bg-orange-600 hover:bg-orange-700 py-2 rounded-lg transition font-semibold">
                    Start Chat
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Chat View */}
      {currentView === "chat" && (
        <div className="max-w-5xl mx-auto mt-20 px-6">
          <h3 className="text-2xl font-bold mb-6">Chat</h3>
          {selectedProvider ? (
            <p className="mb-4 text-gray-400">
              Chatting with{" "}
              <span className="text-orange-400 font-semibold">
                {selectedProvider}
              </span>
            </p>
          ) : (
            <p className="mb-4 text-gray-400 italic">
              General help chat opened from navbar.
            </p>
          )}
          <ChatUI />
        </div>
      )}
    </div>
  );
};

export default AcquirerDashboard;
