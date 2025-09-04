import { Navigate } from "react-router-dom";

// Function to check token expiration
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // decode JWT payload
    const expiry = payload.exp * 1000; // exp is in seconds, convert to ms
    return Date.now() > expiry;
  } catch (error) {
    return true; // if invalid token → treat as expired
  }
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    // remove expired token
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  


  return children;
};

export default ProtectedRoute;
