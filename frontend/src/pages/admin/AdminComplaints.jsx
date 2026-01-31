import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { apiRequest } from "../../api/api";

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");

  const loadComplaints = async () => {
    try {
      const data = await apiRequest("/api/complaints");
      setComplaints(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/api/complaints/${id}/status`, "PUT", { status });
      loadComplaints();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container">
        <h2>Complaints Management</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="card">
          {complaints.length === 0 && <p>No complaints found.</p>}

          {complaints.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c._id}>
                    <td>{c.title}</td>
                    <td>{c.description}</td>
                    <td>{c.status}</td>
                    <td>
                      <select
                        className="input"
                        value={c.status}
                        onChange={(e) =>
                          updateStatus(c._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
