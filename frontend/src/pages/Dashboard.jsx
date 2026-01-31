import Navbar from "../components/Navbar";
import { logout } from "../utils/auth";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <div className="container">
        <h2>SmartSociety Dashboard</h2>

        <div className="card" style={{ marginBottom: 14 }}>
          <button className="btn" onClick={logout}>Logout</button>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <h3>Quick Stats</h3>
            <p>Complaints: 5</p>
            <p>Visitors today: 12</p>
            <p>Pending bills: 8</p>
          </div>

          <div className="card">
            <h3>Recent Activity</h3>
            <ul>
              <li>Notice posted: Water maintenance</li>
              <li>Facility booked: Club House</li>
              <li>Complaint resolved: Lift issue</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
