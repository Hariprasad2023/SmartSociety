import { NavLink } from "react-router-dom";
import { logout } from "../utils/auth";

export default function ResidentNavbar() {
  return (
    <div className="nav">
      <NavLink to="/resident">Dashboard</NavLink>
      <NavLink to="/resident/complaints">Complaints</NavLink>
      <NavLink to="/resident/bills">Bills</NavLink>
      <NavLink to="/resident/facilities">Facilities</NavLink>

      {/* ✅ Add this */}
      <NavLink to="/resident/visitors">Visitors</NavLink>

      <button className="btn secondary" onClick={logout}>Logout</button>
    </div>
  );
}
