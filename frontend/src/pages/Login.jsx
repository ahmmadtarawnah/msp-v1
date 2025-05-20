import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const LegalAidLogo = ({ size = "normal", color = "#DECEB0", hoverColor = "white" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "h-6 w-6",
    normal: "h-10 w-10",
    large: "h-12 w-12",
  };

  return (
    <div
      className={`${sizeClasses[size]} relative cursor-pointer transition-all duration-300 transform ${
        isHovered ? "scale-110" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full transition-all duration-300"
      >
        <circle
          cx="12"
          cy="4"
          r="1.5"
          fill={isHovered ? hoverColor : color}
          className={`transition-all duration-300 ${isHovered ? "animate-pulse" : ""}`}
        />
        <rect
          x="11.5"
          y="4"
          width="1"
          height="10"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />
        <path
          d="M8 20h8l-1-2H9l-1 2z"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />
        <rect
          x="11.5"
          y="14"
          width="1"
          height="4"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />
        <circle
          cx="7"
          cy="10"
          r="2.5"
          fill="transparent"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-500 ${
            isHovered ? "transform translate-y-1" : ""
          }`}
        />
        <circle
          cx="17"
          cy="10"
          r="2.5"
          fill="transparent"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className={`transition-all duration-500 ${
            isHovered ? "transform -translate-y-1" : ""
          }`}
        />
        <line
          x1="12"
          y1="4"
          x2="7"
          y2="10"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className="transition-all duration-300"
        />
        <line
          x1="12"
          y1="4"
          x2="17"
          y2="10"
          stroke={isHovered ? hoverColor : color}
          strokeWidth="1"
          className="transition-all duration-300"
        />
        <circle
          cx="7"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />
        <circle
          cx="17"
          cy="10"
          r="0.5"
          fill={isHovered ? hoverColor : color}
          className="transition-all duration-300"
        />
      </svg>
      {isHovered && (
        <div className="absolute inset-0 rounded-full bg-[#DECEB0] opacity-20 blur-md -z-10"></div>
      )}
    </div>
  );
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(username, password);
      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You are now logged in!",
        confirmButtonText: "Go to Home",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your credentials and try again.",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#2B3B3A] to-[#1A2A29]">
      {/* Background Animation Elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B3B3A]/90 to-[#1A2A29]/90"></div>
        <div className="absolute inset-0 grid grid-cols-[1fr_repeat(16,86.6px)_1fr] grid-rows-[1fr_repeat(8,64px)_1fr] -rotate-12 -skew-x-12">
          <div className="col-start-4 col-end-5 row-start-4 row-end-auto border-2 border-[#DECEB0]/30 animate-[slideLeftRight_3s_ease-in-out_infinite]"></div>
          <div className="col-start-6 col-end-7 row-start-6 row-end-auto bg-[#DECEB0]/20"></div>
          <div className="col-start-7 col-end-8 row-start-7 row-end-auto bg-[#DECEB0]/30 animate-[slideLeftRight_2s_ease-in-out_infinite]"></div>
          <div className="col-start-8 col-end-9 row-start-8 row-end-auto bg-[#DECEB0]/20 animate-[slideLeftRight_3s_ease-in-out_infinite]"></div>
          <div className="col-start-15 col-end-16 row-start-2 row-end-auto bg-[#DECEB0]/30 animate-[slideRightLeft_4s_ease-in-out_infinite]"></div>
          <div className="col-start-14 col-end-15 row-start-3 row-end-auto bg-[#DECEB0]/20 animate-[slideRightLeft_2s_ease-in-out_infinite]"></div>
          <div className="col-start-17 col-end-20 row-start-4 row-end-auto bg-[#DECEB0]/30 animate-[slideRightLeft_4s_ease-in-out_infinite]"></div>
          <div className="col-start-14 col-end-17 row-start-5 row-end-auto border-2 border-[#DECEB0]/30 animate-[slideRightLeft_3s_ease-in-out_infinite]"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col relative z-10">
        <div className="pt-12 pb-6 flex justify-center items-center gap-3">
          <LegalAidLogo size="normal" color="#DECEB0" hoverColor="white" />
          <h1 className="text-3xl font-bold">
            <Link to="/" className="text-[#DECEB0] hover:text-white transition-colors">
              LegalAid
            </Link>
          </h1>
        </div>

        <div className="flex-grow flex justify-center items-center px-4">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg shadow-lg">
              <div className="p-12">
                <span className="block text-xl text-[#DECEB0] mb-6">Sign in to your account</span>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-[#DECEB0] mb-2">
                      Username
                    </label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 rounded-md border border-[#DECEB0]/30 bg-white/10 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent"
                      placeholder="Enter your username"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label htmlFor="password" className="block text-sm font-semibold text-[#DECEB0]">
                        Password
                      </label>
                      <Link to="#" className="text-sm text-[#DECEB0] hover:text-white">
                        Forgot your password?
                      </Link>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-md border border-[#DECEB0]/30 bg-white/10 text-[#DECEB0] placeholder-[#DECEB0]/50 focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:border-transparent"
                      placeholder="Enter your password"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#DECEB0] focus:ring-[#DECEB0] border-[#DECEB0]/30 rounded bg-white/10"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-[#DECEB0]">
                      Stay signed in for a week
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#DECEB0] text-[#2B3B3A] font-semibold rounded-md hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#DECEB0] focus:ring-offset-2 transition-colors"
                  >
                    Continue
                  </button>

                  <div className="text-center">
                    <Link to="#" className="text-[#DECEB0] font-semibold hover:text-white">
                      Use single sign-on (Google) instead
                    </Link>
                  </div>
                </form>
              </div>
            </div>

            <div className="mt-6 text-center">
              <span className="text-[#DECEB0]">
                Don't have an account?{" "}
                <Link to="/Signup" className="text-[#DECEB0] hover:text-white">
                  Sign up
                </Link>
              </span>
              <div className="mt-6 flex justify-center space-x-4 text-sm">
                <Link to="#" className="text-[#DECEB0]/80 hover:text-[#DECEB0]">© LegalAid</Link>
                <Link to="/Contact" className="text-[#DECEB0]/80 hover:text-[#DECEB0]">Contact</Link>
                <Link to="#" className="text-[#DECEB0]/80 hover:text-[#DECEB0]">Privacy & terms</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideLeftRight {
          0% { transform: translateX(0); }
          50% { transform: translateX(1000px); }
          100% { transform: translateX(0); }
        }
        @keyframes slideRightLeft {
          0% { transform: translateX(0); }
          50% { transform: translateX(-1000px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Login;
