import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import Loader from "./shared/loader"; // Import the Loader component

// Import the component

import Home from "./pages/Home";
import ContactUs from "./pages/Contactus";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Booking from "./pages/Booking";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or fetch data
    setTimeout(() => {
      setLoading(false); // Set loading to false after 3 seconds
    }, 2000); // Simulating a 3-second load
  }, []);
  const isLoginPage = location.pathname === "/Login";
  const isSigupPage = location.pathname === "/Signup";

  return (
    <>
      <Router>
        {!isLoginPage && !isSigupPage && <Navbar />}

        {loading ? (
          <Loader />
        ) : (
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Contact" element={<ContactUs />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
            <Route path="/Booking" element={<Booking />} />
          </Routes>
        )}
        {/* Only render Footer if we're not on the login page */}
        {!isLoginPage && !isSigupPage && <Footer />}
      </Router>
    </>
  );
}

export default App;
