// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
    return <Navigate to="/" replace />;
  }

  return children;
};
