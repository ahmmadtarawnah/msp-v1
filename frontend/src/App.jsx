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

import Home from "./pages/Home";
import ContactUs from "./pages/Contactus";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile"; // Import Profile page

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

  const isLoginPage = location.pathname === "/Login";
  const isSignupPage = location.pathname === "/Signup";

  return (
    <>
      {/* Navbar is hidden on Login and Signup pages */}
      {!isLoginPage && !isSignupPage && <Navbar />}

      {/* Show loader while loading */}
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Contact" element={<ContactUs />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Booking" element={<Booking />} />
          <Route path="/Profile" element={<Profile />} />{" "}
          
        </Routes>
      )}

      {/* Footer is hidden on Login and Signup pages */}
      {!isLoginPage && !isSignupPage && <Footer />}
    </>
  );
};

export default App;
