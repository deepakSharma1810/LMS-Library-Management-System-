import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAuth();

  if (!token) {
    return <Navigate to="/admin-signin" replace />;
  }

  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    return <Navigate to="/admin-signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
