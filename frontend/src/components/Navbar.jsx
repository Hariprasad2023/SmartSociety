import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="nav">
        <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Login</NavLink>
      <NavLink to="/dashboard" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink>
      <NavLink to="/complaints" className={({isActive}) => isActive ? "active" : ""}>Complaints</NavLink>
      <NavLink to="/visitors" className={({isActive}) => isActive ? "active" : ""}>Visitors</NavLink>
      <NavLink to="/bills" className={({isActive}) => isActive ? "active" : ""}>Bills</NavLink>
      <NavLink to="/notices" className={({isActive}) => isActive ? "active" : ""}>Notices</NavLink>
      <NavLink to="/facilities" className={({isActive}) => isActive ? "active" : ""}>Facilities</NavLink>
    </div>
  );
}
