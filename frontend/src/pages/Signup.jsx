import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, username, password);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You have been registered and logged in successfully.",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data?.message || "An error occurred during registration",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
      {/* Left Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-center text-4xl font-extrabold text-[#DECEB0]">
              Create Account
            </h2>
            <p className="mt-2 text-center text-sm text-[#DECEB0]/80">
              Already have an account?{" "}
              <Link
                to="/Login"
                className="font-medium text-[#DECEB0] hover:text-white transition-colors"
              >
                Sign in here
              </Link>
            </p>
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-[#DECEB0] hover:text-white transition-colors flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
          >
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-[#DECEB0] text-sm font-semibold mb-2"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#DECEB0]/30 placeholder-[#DECEB0]/50 text-[#DECEB0] bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-[#DECEB0] text-sm font-semibold mb-2"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#DECEB0]/30 placeholder-[#DECEB0]/50 text-[#DECEB0] bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent"
                  placeholder="Choose a username"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-[#DECEB0] text-sm font-semibold mb-2"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-[#DECEB0]/30 placeholder-[#DECEB0]/50 text-[#DECEB0] bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-[#2B3B3A] bg-[#DECEB0] hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#DECEB0] transition-all duration-300 transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          </form>

          {/* Social Signup Options */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#DECEB0]/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#2B3B3A] text-[#DECEB0]">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-[#DECEB0]/30 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-[#DECEB0] hover:bg-white/20"
              >
                Google
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-[#DECEB0]/30 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-[#DECEB0] hover:bg-white/20"
              >
                Facebook
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-[#DECEB0]/30 rounded-lg shadow-sm bg-white/10 text-sm font-medium text-[#DECEB0] hover:bg-white/20"
              >
                Apple
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image Section */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="https://images.pexels.com/photos/5668772/pexels-photo-5668772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Legal Justice Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 right-10 text-white p-6 text-right">
          <h2 className="text-4xl font-bold mb-4">Welcome to LegalAid</h2>
          <p className="text-xl">
            Your trusted partner in legal support and guidance
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
