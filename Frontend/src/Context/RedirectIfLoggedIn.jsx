import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { RingLoader } from "react-spinners";

const RedirectIfLoggedIn = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  useEffect(() => {
    axios
      .get("https://thinkspace-qowf.onrender.com/api/user/loggeduser", { withCredentials: true })
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) return 
  <div style={{height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"}}>
    <RingLoader
    color="#008325"
    size={80}/>
    Loading...</div>; // optional loading state
  if (isLoggedIn) return <Navigate to="/dashboard" />;

  return children;
};

export default RedirectIfLoggedIn;