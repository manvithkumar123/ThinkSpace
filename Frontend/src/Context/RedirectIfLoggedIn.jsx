import { Navigate } from "react-router-dom";

const RedirectIfLoggedIn = ({ children }) => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("usertoken="))
    ?.split("=")[1];

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RedirectIfLoggedIn;