import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Mail, Phone, Calendar, MessageSquare } from "lucide-react";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authData } = useAuth();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/contact", {
        headers: { Authorization: `Bearer ${authData.token}` },
      });
      setContacts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError("Failed to fetch contact submissions");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2B3B3A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-[#2B3B3A] mb-6">Contact Submissions</h2>
      
      <div className="grid gap-6">
        {contacts.map((contact) => (
          <div
            key={contact._id}
            className="bg-[#f5f5fa] rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#2B3B3A]">{contact.name}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>{contact.email}</span>
                </div>
                {contact.phone && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{contact.phone}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span>{new Date(contact.dateSubmitted).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center text-[#2B3B3A] font-medium mb-2">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>{contact.subject}</span>
              </div>
              <p className="text-gray-700 bg-white p-4 rounded-lg border border-gray-200">
                {contact.message}
              </p>
            </div>
          </div>
        ))}
        
        {contacts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No contact submissions yet
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts; 