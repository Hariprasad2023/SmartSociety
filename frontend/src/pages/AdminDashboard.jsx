import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  return (
    <>
      <AdminNavbar />
      <div className="container">
        <h2>Admin Dashboard</h2>
        <div className="grid grid-2">
          <div className="card">Manage Complaints</div>
          <div className="card">Generate Bills</div>
          <div className="card">View Facilities</div>
          <div className="card">Visitor Logs</div>
        </div>
      </div>
    </>
  );
}
