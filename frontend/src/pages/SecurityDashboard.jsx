import SecurityNavbar from "../components/SecurityNavbar";

export default function SecurityDashboard() {
  return (
    <>
      <SecurityNavbar />
      <div className="container">
        <h2>Security Dashboard</h2>
        <div className="card">
          <h3>Gate Entry</h3>
          <p>Add visitors and maintain visitor log.</p>
        </div>
      </div>
    </>
  );
}
