import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const RedirectIfLoggedIn = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  useEffect(() => {
    axios
      .get("https://thinkspace-qowf.onrender.com/api/user/loggeduser", { withCredentials: true })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) return <div style={{height:"100vh",width:"100vw",backgroundColor:"red"}}>Loading...</div>; // optional loading state
  if (isLoggedIn) return <Navigate to="/dashboard" />;

  return children;
};

export default RedirectIfLoggedIn;