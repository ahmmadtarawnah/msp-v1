import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? { token } : null;
  });

  // On app load, check if the token is available in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthData({ token });
    }
  }, []);



  const register = async (name, username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          name,
          username,
          password,
        }
      );
      const token = response.data.token;
      localStorage.setItem("token", token); // Store token in localStorage
      setAuthData({ token });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error; // Throw error to be handled in the component
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
      const token = response.data.token;
      const user = {
        name: response.data.name,
        email: response.data.email,
      };
      localStorage.setItem("token", token); // Store token in localStorage
      setAuthData({ token, ...user });
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Throw error to be handled in component
    }
  };



  const logout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setAuthData(null); // Clear the authData state
    axios.defaults.headers.common["Authorization"] = ""; // Remove Authorization header from axios
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
