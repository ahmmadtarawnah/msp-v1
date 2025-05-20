import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import Loader from "../shared/Loader";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const LawyerStatistics = () => {
  const { authData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    acceptedAppointments: 0,
    pendingAppointments: 0,
    cancelledAppointments: 0,
    totalEarnings: 0,
    recentAppointments: [],
    rates: {
      hourlyRate: 0,
      halfHourlyRate: 0
    }
  });

  useEffect(() => {
    if (authData?.userId) {
      fetchStatistics();
    }
  }, [authData]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/appointments/lawyer/${authData.userId}/statistics`,
        {
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        }
      );
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart Data
  const pieData = {
    labels: ['Accepted', 'Pending', 'Cancelled'],
    datasets: [
      {
        label: 'Appointments',
        data: [stats.acceptedAppointments, stats.pendingAppointments, stats.cancelledAppointments],
        backgroundColor: [
          'rgba(34,197,94,0.6)', // green
          'rgba(251,191,36,0.6)', // yellow
          'rgba(239,68,68,0.6)', // red
        ],
        borderColor: [
          'rgba(34,197,94,1)',
          'rgba(251,191,36,1)',
          'rgba(239,68,68,1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Group earnings per day for recent appointments
  const earningsPerDay = stats.recentAppointments.reduce((acc, app) => {
    const date = new Date(app.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + (app.rate || 0);
    return acc;
  }, {});
  const barData = {
    labels: Object.keys(earningsPerDay),
    datasets: [
      {
        label: 'Earnings',
        data: Object.values(earningsPerDay),
        backgroundColor: 'rgba(59,130,246,0.6)',
        borderColor: 'rgba(59,130,246,1)',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Recent Appointments Earnings' },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#3A4B4A] mb-6">Statistics Overview</h2>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-4 text-[#3A4B4A]">Appointment Status Distribution</h3>
          <div style={{ width: 220, height: 220 }}>
            <Pie data={pieData} width={200} height={200} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
          <div style={{ width: 260, height: 220 }}>
            <Bar data={barData} options={{ ...barOptions, maintainAspectRatio: false }} width={240} height={200} />
          </div>
        </div>
      </div>

      {/* Rates Information */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-[#3A4B4A] mb-4">Consultation Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F5F0E6] rounded-lg p-4">
            <p className="text-gray-500 text-sm">Hourly Rate (60 minutes)</p>
            <p className="text-2xl font-bold text-[#3A4B4A]">${stats.rates.hourlyRate}</p>
          </div>
          <div className="bg-[#F5F0E6] rounded-lg p-4">
            <p className="text-gray-500 text-sm">Half-Hour Rate (30 minutes)</p>
            <p className="text-2xl font-bold text-[#3A4B4A]">${stats.rates.halfHourlyRate}</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Appointments Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Appointments</p>
              <h3 className="text-3xl font-bold text-[#3A4B4A] mt-2">{stats.totalAppointments}</h3>
            </div>
            <div className="bg-[#E8D8B0] p-3 rounded-full">
              <svg className="w-8 h-8 text-[#3A4B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Accepted Appointments Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Accepted Appointments</p>
              <h3 className="text-3xl font-bold text-[#3A4B4A] mt-2">{stats.acceptedAppointments}</h3>
            </div>
            <div className="bg-[#E8D8B0] p-3 rounded-full">
              <svg className="w-8 h-8 text-[#3A4B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pending Appointments Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Appointments</p>
              <h3 className="text-3xl font-bold text-[#3A4B4A] mt-2">{stats.pendingAppointments}</h3>
            </div>
            <div className="bg-[#E8D8B0] p-3 rounded-full">
              <svg className="w-8 h-8 text-[#3A4B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Earnings Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <h3 className="text-3xl font-bold text-[#3A4B4A] mt-2">${stats.totalEarnings.toFixed(2)}</h3>
            </div>
            <div className="bg-[#E8D8B0] p-3 rounded-full">
              <svg className="w-8 h-8 text-[#3A4B4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-[#3A4B4A] mb-4">Recent Appointments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {appointment.clientName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.duration} minutes
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${appointment.rate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LawyerStatistics; 