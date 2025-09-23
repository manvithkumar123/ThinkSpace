import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "./loading.css"
import { RingLoader } from "react-spinners";

const RedirectIfLoggedIn = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    axios
      .get("https://thinkspace-qowf.onrender.com/api/user/loggeduser", { withCredentials: true })
      .then(() => setIsLoggedIn(true)) 
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) return 
  <div className="loadingstate">
      <RingLoader
      color="#008325"size={80}/>
  </div>
  if (isLoggedIn) return <Navigate to="/dashboard" />;

  return children;
};

export default RedirectIfLoggedIn;