import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { apiRequest } from "../../api/api";

export default function AdminVisitors() {
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await apiRequest("/api/visitors");
      setVisitors(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className="container">
        <h2>Visitor Logs</h2>

        <div className="card">
          {error && <p style={{ color: "red" }}>{error}</p>}
          {visitors.length === 0 && <p>No visitors found.</p>}

          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Flat</th>
                <th>Purpose</th>
                <th>Entry Time</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v._id}>
                  <td>{v.name}</td>
                  <td>{v.flatNo || v.flat}</td>
                  <td>{v.purpose || "-"}</td>
                  <td>
                    {v.entryTime
                      ? new Date(v.entryTime).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
