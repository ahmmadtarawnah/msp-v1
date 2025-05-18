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
import Loader from "./shared/Loader"; // Changed from loader to Loader
import { useAuth } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import VideoCall from './components/VideoCall';

import Home from "./pages/Home";
import ContactUs from "./pages/Contactus";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile"; // Import Profile page
import AdminDashboard from "./pages/AdminDashboard";
import BecomeAlawyer from "./pages/BecomeAlawyer"; // Import Become a Lawyer page
import LawyerDashboard from "./pages/LawyerDashboard"; // Import Lawyer Dashboard page
import LawyerAppointments from "./pages/LawyerAppointments";
import LawyerDetails from "./pages/LawyerDetails";
import About from "./pages/About";
import LegalServices from "./pages/LegalServices";
import Blogs from "./pages/Blogs";

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
        <ScrollToTop />
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
  const isAdminDashboard = location.pathname.startsWith("/admin-dashboard");
  const isLawyerDashboard = location.pathname.startsWith("/lawyer-dashboard");
  const isBecomeLawyerPage = location.pathname === "/become-a-lawyer";

  if (loading || isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen">
      {/* Navbar is hidden on Login, Signup, and Dashboard pages */}
      {!isLoginPage && !isSignupPage && !isAdminDashboard && !isLawyerDashboard && !isBecomeLawyerPage && <Navbar />}

      <main className={`${!isLoginPage && !isSignupPage && !isAdminDashboard && !isLawyerDashboard && !isBecomeLawyerPage ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Contact" element={<ContactUs />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Booking" element={<Booking />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          <Route path="/become-a-lawyer" element={<BecomeAlawyer />} />
          <Route path="/lawyer-dashboard/*" element={<LawyerDashboard />} />
          <Route path="/lawyer-dashboard/appointments" element={<LawyerAppointments />} />
          <Route path="/lawyer-details" element={<LawyerDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/legal-services" element={<LegalServices />} />
          <Route path="/video-call/:appointmentId" element={<VideoCall />} />
          <Route path="/Blogs" element={<Blogs />} />
        </Routes>
      </main>

      {/* Footer is hidden on Login, Signup, and Dashboard pages */}
      {!isLoginPage && !isSignupPage && !isAdminDashboard && !isLawyerDashboard && !isBecomeLawyerPage && <Footer />}
    </div>
  );
};

export default App;
