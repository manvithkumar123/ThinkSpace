import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("usertoken="))
    ?.split("=")[1];

  if (!token) {
    // If token does not exist, redirect to login
    return <Navigate to="/login" />;
  }

  return children; // otherwise render the page
};

export default ProtectedRoute;