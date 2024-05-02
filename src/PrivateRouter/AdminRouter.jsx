import React, { useContext } from "react";
import useAuth from "../hook/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import useAdmin from "../hook/useAdmin";

const AdminRouter = ({ children }) => {
  const { user } = useAuth();
  const { isAdmin, isAdminLoading } = useAdmin();
  const location = useLocation();
  if (user && isAdmin) {
    return children;
  }
  return <Navigate to="/signin" state={{ from: location }} replace />;
};

export default AdminRouter;