import { useNavigate } from "react-router-dom";
import ResidentNavbar from "../components/ResidentNavbar";

export default function ResidentDashboard() {
  const navigate = useNavigate();

  const Card = ({ title, desc, path }) => (
    <div className="card" style={{ cursor: "pointer" }} onClick={() => navigate(path)}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p style={{ color: "#555" }}>{desc}</p>
      <button className="btn" onClick={() => navigate(path)}>Open</button>
    </div>
  );

  return (
    <>
      <ResidentNavbar />
      <div className="container">
        <h2>Resident Dashboard</h2>

        <div className="grid grid-2" style={{ marginTop: 14 }}>
          <Card title="My Complaints" desc="Raise and track your complaints." path="/resident/complaints" />
          <Card title="My Bills" desc="View your maintenance bills." path="/resident/bills" />
          <Card title="Facilities" desc="Book and view your facility bookings." path="/resident/facilities" />
          <Card title="Notices" desc="Read society announcements." path="/resident/notices" />
        </div>
      </div>
    </>
  );
}
