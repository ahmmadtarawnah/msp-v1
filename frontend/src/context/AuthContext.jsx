import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, check if the token is available in cookies
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = Cookies.get("token");
        if (token) {
          // Try to get auth data from localStorage first
          const storedAuthData = localStorage.getItem("authData");
          if (storedAuthData) {
            const parsedData = JSON.parse(storedAuthData);
            setAuthData(parsedData);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          }
          
          // Always fetch fresh profile data
          await fetchUserProfile(token);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        // Clear invalid auth data
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newAuthData = {
        token,
        userId: response.data._id,
        name: response.data.name,
        username: response.data.username,
        role: response.data.role
      };
      setAuthData(newAuthData);
      localStorage.setItem("authData", JSON.stringify(newAuthData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      // If profile fetch fails, clear auth data
      logout();
    }
  };

  const register = async (name, username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          username,
          password,
          role: "user"
        }
      );
      const { token, name: userName, username: userUsername, role: userRole, _id: userId } = response.data;
      const newAuthData = { token, userId, name: userName, username: userUsername, role: userRole };
      
      // Set token in cookies
      Cookies.set("token", token, { expires: 1 });
      
      // Store auth data in localStorage
      localStorage.setItem("authData", JSON.stringify(newAuthData));
      
      // Update auth state
      setAuthData(newAuthData);
      
      // Set default authorization header for all axios requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Fetch fresh profile data to ensure everything is up to date
      await fetchUserProfile(token);
      
      return newAuthData;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        }
      );
      const { token, name, username: userUsername, role, _id: userId } = response.data;
      const newAuthData = { token, userId, name, username: userUsername, role };
      Cookies.set("token", token, { expires: 1 });
      localStorage.setItem("authData", JSON.stringify(newAuthData));
      setAuthData(newAuthData);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
      // Redirect based on role
      if (role === "admin") {
        window.location.href = "/admin-dashboard";
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("authData");
    setAuthData(null);
    axios.defaults.headers.common["Authorization"] = "";
  };

  const value = {
    authData,
    isLoading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
