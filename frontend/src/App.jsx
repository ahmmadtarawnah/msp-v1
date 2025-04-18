import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import Loader from "./shared/loader"; // Import the Loader component
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import ContactUs from "./pages/Contactus";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile"; // Import Profile page
import AdminDashboard from "./pages/AdminDashboard";

import { AuthProvider } from "./context/AuthContext"; // Import the AuthProvider

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 2000);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppRoutes loading={loading} />
      </Router>
    </AuthProvider>
  );
}

const AppRoutes = ({ loading }) => {
  const location = useLocation();
  const { isLoading } = useAuth();

  const isLoginPage = location.pathname === "/Login";
  const isSignupPage = location.pathname === "/Signup";
  const isAdminDashboard = location.pathname === "/admin-dashboard";

  if (loading || isLoading) {
    return <Loader />;
  }

  return (
    <>
      {/* Navbar is hidden on Login, Signup, and Admin Dashboard pages */}
      {!isLoginPage && !isSignupPage && !isAdminDashboard && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Contact" element={<ContactUs />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>

      {/* Footer is hidden on Login, Signup, and Admin Dashboard pages */}
      {!isLoginPage && !isSignupPage && !isAdminDashboard && <Footer />}
    </>
  );
};

export default App;
