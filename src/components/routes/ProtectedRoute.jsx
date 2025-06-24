import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, authLoading } = useContext(AuthContext);
  const location = useLocation();

  if (authLoading) return null;

  if (!currentUser) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;
