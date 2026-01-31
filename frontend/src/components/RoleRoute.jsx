import { Navigate } from "react-router-dom";
import { isLoggedIn, getRole } from "../utils/auth";

export default function RoleRoute({ allowedRoles, children }) {
  if (!isLoggedIn()) return <Navigate to="/" replace />;

  const role = getRole();
  if (!role) return <Navigate to="/" replace />;

  if (!allowedRoles.includes(role)) {
    // Redirect user to their correct dashboard
    if (role === "Admin") return <Navigate to="/admin" replace />;
    if (role === "Resident") return <Navigate to="/resident" replace />;
    if (role === "Security") return <Navigate to="/security" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
