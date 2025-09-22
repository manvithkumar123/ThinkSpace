import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  useEffect(() => {
    axios
      .get("https://thinkspace-qowf.onrender.com/api/user/loggeduser", { withCredentials: true })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) return <div>Loading...</div>; // optional loading state
  if (!isLoggedIn) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;