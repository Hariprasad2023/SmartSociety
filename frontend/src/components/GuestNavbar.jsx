// src/components/GuestNavbar.jsx
import { NavLink } from "react-router-dom";

export default function GuestNavbar() {
  return (
    <div className="nav">
      <NavLink to="/guest">Home</NavLink>
      
      <NavLink to="/guest/amenities">Amenities</NavLink>
      <NavLink to="/guest/contact">Contact</NavLink>
    </div>
  );
}
