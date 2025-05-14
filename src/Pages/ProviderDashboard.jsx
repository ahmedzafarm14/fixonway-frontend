import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatUI from "./ChatUI.jsx";
import axios from "axios";
import MapComponent from "../Components/Map.jsx";
import ErrorAlert from "../Components/ErrorAlert.jsx";
import SuccessAlert from "../Components/SuccessAlert.jsx";

const FixonwayDashboard = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [categories, setCategories] = useState([]);
  const [newService, setNewService] = useState({
    name: "",
    details: "",
    price: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [newServiceModal, setNewServiceModal] = useState(false);
  const [isOnline, setIsOnline] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        return parsed.isAvailable ?? false;
      } catch (err) {
        console.error("Failed to parse user from sessionStorage:", err);
      }
    }
    return false;
  });

  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const handleEdit = (service) => {
    setEditingService(service);
  };
  const handleNewServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleNewServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/services/add-service`,
        {
          ...newService,
          providerId: sessionStorage.getItem("userId"),
        },
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );
      setServices((prev) => [...prev, response.data]);

      setSuccessMessage("Service created successfully!");
    } catch (error) {
      console.error("Error creating new service:", error);
      setErrorMessage("Failed to create service. Please try again.");
      return;
    } finally {
      setNewServiceModal(false);
      setNewService({
        name: "",
        details: "",
        price: "",
      });
    }
  };
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);
  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedService = {
      id: editingService.id,
      name: formData.get("name"),
      price: formData.get("price"),
    };

    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
    setEditingService(null);
  };

  const confirmDelete = (id) => {
    setServiceToDelete(id);
    setShowDeleteModal(true);
  };

  const deleteService = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/services/delete-service/${serviceToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      const updatedServices = services.filter(
        (serviceee) => serviceee._id !== serviceToDelete
      );
      setServices(updatedServices);
      setSuccessMessage("Service deleted successfully!");
    } catch (error) {
      console.error("Error deleting service:", error);
      setErrorMessage("Failed to delete service. Please try again.");
    } finally {
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          `${
            process.env.REACT_APP_BACKEND_BASE_URL
          }/api/services/provider/${sessionStorage.getItem("userId")}`,
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);
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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center"
                >
                  {/* <svg
                    className="h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg> */}
                </motion.div>
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Fixonway
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("analytics")}
                  className={`${
                    activeTab === "analytics"
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Analytics
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("services")}
                  className={`${
                    activeTab === "services"
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  My Services
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab("chat")}
                  className={`${
                    activeTab === "chat"
                      ? "border-indigo-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Customer Chat
                </motion.button>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="ml-3 flex items-center space-x-2">
                <motion.div
                  onClick={async () => {
                    try {
                      const newStatus = !isOnline;
                      setIsOnline(newStatus);

                      const response = await axios.post(
                        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/status-change`,
                        { changeStatus: newStatus },
                        {
                          headers: {
                            Authorization: `Bearer ${sessionStorage.getItem(
                              "token"
                            )}`,
                          },
                        }
                      );
                      console.log(response.data.message);
                      const storedUser = sessionStorage.getItem("user");
                      if (storedUser) {
                        const user = JSON.parse(storedUser);
                        user.isAvailable = newStatus;
                        sessionStorage.setItem("user", JSON.stringify(user));
                      }
                    } catch (error) {
                      console.error(
                        "Error updating user status:",
                        error.response.data
                      );
                      setIsOnline(!isOnline);
                      const storedUser = sessionStorage.getItem("user");
                      if (storedUser) {
                        const user = JSON.parse(storedUser);
                        user.isAvailable = isOnline;
                        sessionStorage.setItem("user", JSON.stringify(user));
                      }
                    }
                  }}
                  className="relative inline-flex items-center h-6 w-12 rounded-full cursor-pointer"
                  initial={false}
                  animate={{
                    backgroundColor: isOnline ? "#4ade80" : "#9ca3af", // Tailwind's green-400 and gray-400
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className="absolute left-1 h-5 w-5 bg-white rounded-full shadow"
                    animate={{ x: isOnline ? 24 : 0 }}
                  />
                </motion.div>
                <span
                  className={`text-sm font-medium ${
                    isOnline ? "text-green-700" : "text-gray-600"
                  }`}
                >
                  {isOnline ? "Online" : "Offline"}
                </span>
              </div>

              <div className="ml-3 relative">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {errorMessage && errorMessage.length > 1 && (
        <ErrorAlert error={errorMessage} className="fixed" />
      )}
      {successMessage && successMessage.length > 1 && (
        <SuccessAlert success={successMessage} className="fixed" />
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        {["services", "analytics"].includes(activeTab) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8 lg:p-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Welcome to Fixonway Dashboard
                  </h1>
                  <p className="text-indigo-100 max-w-2xl">
                    Manage your services, connect with customers, and grow your
                    business
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNewServiceModal(true)}
                  className="mt-4 md:mt-0 px-6 py-2 bg-white text-indigo-600 font-medium rounded-lg shadow hover:bg-gray-100"
                >
                  Add New Service
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "services" && (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow rounded-lg overflow-hidden mb-8"
            >
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  My Services
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your service listings
                </p>
              </div>
              <div className="bg-white overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Service
                        </th>

                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Price
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {services.map((service, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          whileHover={{ scale: 1.01 }}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {service.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {service.price}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(service)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              Edit
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => confirmDelete(service._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow rounded-lg overflow-hidden mb-8"
            >
              {/* Your existing chat component would go here */}
              <ChatUI />
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow rounded-lg overflow-hidden mb-8"
            >
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Service Analytics
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  View your service performance
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-indigo-50 rounded-lg p-6 shadow"
                  >
                    <h4 className="text-lg font-medium text-indigo-800">
                      Total Services
                    </h4>
                    <p className="text-3xl font-bold text-indigo-600 mt-2">
                      {services.length}
                    </p>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-green-50 rounded-lg p-1 shadow"
                  >
                    <MapComponent
                      coordinates={(() => {
                        const us = sessionStorage.getItem("user");
                        if (!us) return null;
                        try {
                          const parsedUs = JSON.parse(us);
                          return parsedUs?.location?.coordinates || null;
                        } catch (e) {
                          console.error("Failed to parse user:", e);
                          return null;
                        }
                      })()}
                    />
                  </motion.div>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">
                    Analytics Charts
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Service performance charts would be displayed here.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Edit Service Modal */}
        {editingService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Edit Service
                </h3>
              </div>
              <form onSubmit={handleSave}>
                <div className="p-6 space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Service Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={editingService.name}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      defaultValue={editingService.category}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option>Tire Services</option>
                      <option>Maintenance</option>
                      <option>Electrical</option>
                      <option>Mechanical</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      id="price"
                      defaultValue={editingService.price}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setEditingService(null)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Delete Service
                </h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this service? This action
                  cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={deleteService}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* New Service Modal */}
        {newServiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Add New Service
                </h3>
              </div>
              <form onSubmit={handleNewServiceSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <select
                      id="name"
                      name="name"
                      onChange={handleNewServiceChange}
                      defaultValue=""
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition ease-in-out duration-150 max-w-full"
                    >
                      <option value="" disabled className="text-gray-400">
                        Select a category
                      </option>
                      {categories.map((category, index) => (
                        <option key={index} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Details
                    </label>
                    <textarea
                      rows={2}
                      name="details"
                      onChange={handleNewServiceChange}
                      id="details"
                      placeholder="Service details"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price
                    </label>
                    <input
                      type="text"
                      name="price"
                      onChange={handleNewServiceChange}
                      id="price"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setNewServiceModal(null)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default FixonwayDashboard;
