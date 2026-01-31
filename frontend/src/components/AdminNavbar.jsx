import { NavLink } from "react-router-dom";
import { logout } from "../utils/auth";

export default function AdminNavbar() {
  return (
    <div className="nav">
      <NavLink to="/admin">Dashboard</NavLink>
      <NavLink to="/admin/complaints">Complaints</NavLink>
      <NavLink to="/admin/bills">Bills</NavLink>
      <NavLink to="/admin/facilities">Facilities</NavLink>
      <NavLink to="/admin/visitors">Visitors</NavLink>
      <NavLink to="/admin/notices">Notices</NavLink>
      <NavLink to="/admin/users">Users</NavLink>
      <button className="btn secondary" onClick={logout}>Logout</button>
    </div>
  );
}
