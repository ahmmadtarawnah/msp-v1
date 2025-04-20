import React from "react";
import LawyerSidebar from "../components/LawyerSidebar";

const LawyerAppointments = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
      <div className="flex">
        <LawyerSidebar />
        <div className="ml-64 flex-1 p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-[#2B3B3A] mb-6">Appointments</h2>
            <div className="space-y-6">
              {/* Appointments content will go here */}
              <p className="text-gray-600">Appointments management coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerAppointments; 