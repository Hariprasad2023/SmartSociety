// src/components/SecurityNavbar.jsx
import { NavLink } from "react-router-dom";
import { logout } from "../utils/auth";

export default function SecurityNavbar() {
  return (
    <div className="nav">
      <NavLink to="/security">Dashboard</NavLink>
      <NavLink to="/security/visitors">Visitors</NavLink>
      <button className="btn secondary" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
