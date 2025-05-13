import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Routes, Route, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import AdminSidebar from "../components/AdminSidebar";
import LawyerApplications from "../components/LawyerApplications";
import AddBlog from "../components/AddBlog";
import UserManagement from "../components/UserManagement";

const AdminDashboard = () => {
  const { authData, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalAdmins: 0,
  });

  useEffect(() => {
    if (!authData || authData.role !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [authData, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/users",
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        }
      );
      setUsers(response.data.users);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch users data. Please make sure you are logged in as an admin.",
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2B3B3A",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${authData.token}` },
        });
        setUsers(users.filter((user) => user._id !== userId));
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete user. Please make sure you have admin privileges.",
      });
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        }
      );
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      Swal.fire("Success!", "User role updated successfully.", "success");
    } catch (error) {
      console.error("Error updating user role:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user role. Please make sure you have admin privileges.",
      });
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out and redirected to the home page.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2B3B3A",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, log me out!",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/");
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B3B3A]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f5f5f5]">
      {/* Keep the existing AdminSidebar */}
      <div className="w-full md:w-64 md:fixed md:top-0 md:bottom-0 md:overflow-y-auto bg-white shadow-md z-10">
        <AdminSidebar />
      </div>

      {/* Main content area with responsive adjustments */}
      <div className="flex-1 w-full md:ml-64">
        {/* Top Navigation Bar */}
        <div className="bg-white shadow-sm sticky top-0 z-10">
          <div className="flex justify-between items-center px-4 sm:px-6 py-4">
            <h1 className="text-xl sm:text-2xl font-bold text-[#2B3B3A]">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="bg-[#2B3B3A] hover:bg-[#1a2a29] text-white font-medium py-2 px-3 sm:px-4 rounded-lg transition-colors duration-300 text-sm sm:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 sm:p-6">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md border border-gray-100 transition-transform hover:translate-y-[-2px]">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                        Total Users
                      </h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-[#2B3B3A]">
                          {stats.totalUsers}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md border border-gray-100 transition-transform hover:translate-y-[-2px]">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                        Total Lawyers
                      </h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-[#2B3B3A]">
                          {stats.totalLawyers}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md border border-gray-100 transition-transform hover:translate-y-[-2px]">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                        Total Admins
                      </h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                            />
                          </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-[#2B3B3A]">
                          {stats.totalAdmins}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                        User Management
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Username
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr
                              key={user._id}
                              className="hover:bg-gray-50 transition-colors duration-150"
                            >
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base font-medium text-gray-900">
                                {user.name}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm sm:text-base text-gray-700">
                                {user.username}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                {user.role === "lawyer" ? (
                                  <span className="px-2 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Lawyer
                                  </span>
                                ) : (
                                  <div className="relative inline-block">
                                    <select
                                      value={user.role}
                                      onChange={(e) =>
                                        handleUpdateRole(
                                          user._id,
                                          e.target.value
                                        )
                                      }
                                      className="appearance-none bg-gray-50 text-gray-700 border border-gray-300 rounded-md py-1 px-3 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-[#2B3B3A] focus:border-[#2B3B3A] text-sm"
                                    >
                                      <option value="user">User</option>
                                      <option value="admin">Admin</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                      <svg
                                        className="h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </div>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="text-red-600 hover:text-red-900 transition-colors duration-200 flex items-center"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {users.length === 0 && (
                        <div className="text-center py-8">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 mx-auto text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                          </svg>
                          <p className="mt-2 text-gray-500">No users found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              }
            />
            <Route path="/applications" element={<LawyerApplications />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/add-blog" element={<AddBlog />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
