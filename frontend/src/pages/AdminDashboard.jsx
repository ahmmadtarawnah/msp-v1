import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate, Routes, Route, Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import AdminSidebar from "../components/AdminSidebar";
import LawyerApplications from "../components/LawyerApplications";
import AddBlog from "../components/AddBlog";
import UserManagement from "../components/UserManagement";
import AdminContacts from "../components/AdminContacts";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
  const [totalPayments, setTotalPayments] = useState(0);

  useEffect(() => {
    if (!authData || authData.role !== "admin") {
      navigate("/");
      return;
    }
    fetchUsers();
    fetchPayments();
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

  const fetchPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/payments", {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      const payments = response.data;
      const total = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
      setTotalPayments(total);
    } catch (error) {
      console.error("Error fetching payments:", error);
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
                  {/* Statistics Charts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* User Role Distribution Pie Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col items-center">
                      <h3 className="text-lg font-semibold text-[#2B3B3A] mb-4">User Role Distribution</h3>
                      <Pie
                        data={{
                          labels: ['Users', 'Lawyers', 'Admins'],
                          datasets: [
                            {
                              data: [
                                stats.totalUsers - stats.totalLawyers - stats.totalAdmins,
                                stats.totalLawyers,
                                stats.totalAdmins,
                              ],
                              backgroundColor: [
                                '#60A5FA', // blue
                                '#34D399', // green
                                '#A78BFA', // purple
                              ],
                              borderColor: '#fff',
                              borderWidth: 2,
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: {
                              display: true,
                              position: 'bottom',
                              labels: { color: '#2B3B3A', font: { size: 14 } },
                            },
                          },
                        }}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                    {/* Payment Chart */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col items-center">
                      <h3 className="text-lg font-semibold text-[#2B3B3A] mb-4">Payment Overview</h3>
                      <Bar
                        data={{
                          labels: ['Total Payments'],
                          datasets: [
                            {
                              label: 'Amount ($)',
                              data: [totalPayments],
                              backgroundColor: '#FBBF24',
                              borderRadius: 8,
                            },
                          ],
                        }}
                        options={{
                          plugins: {
                            legend: { display: false },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: { 
                                color: '#2B3B3A', 
                                font: { size: 14 },
                                callback: function(value) {
                                  return '$' + value;
                                }
                              },
                              grid: { color: '#F3F4F6' },
                            },
                            x: {
                              ticks: { color: '#2B3B3A', font: { size: 14 } },
                              grid: { display: false },
                            },
                          },
                        }}
                        className="w-full max-w-xs mx-auto"
                      />
                    </div>
                  </div>
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

                    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-md border border-gray-100 transition-transform hover:translate-y-[-2px]">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">
                        Total Payments
                      </h3>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-4.41 0-8-1.79-8-4V6c0-2.21 3.59-4 8-4s8 1.79 8 4v8c0 2.21-3.59 4-8 4z" />
                          </svg>
                        </div>
                        <p className="text-2xl sm:text-3xl font-bold text-[#2B3B3A]">
                          ${totalPayments.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              }
            />
            <Route path="/applications" element={<LawyerApplications />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/contacts" element={<AdminContacts />} />
            <Route path="/add-blog" element={<AddBlog />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
