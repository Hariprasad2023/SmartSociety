import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { getRole } from "../utils/auth";

import AdminNavbar from "../components/AdminNavbar";
import ResidentNavbar from "../components/ResidentNavbar";
import SecurityNavbar from "../components/SecurityNavbar";

export default function Notices() {
  const role = getRole();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);
  const [error, setError] = useState("");

  // Load all notices
  const loadNotices = async () => {
    try {
      const data = await apiRequest("/api/notices");
      setNotices(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  // Admin: add notice
  const addNotice = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/api/notices", "POST", {
        title,
        message
      });
      setTitle("");
      setMessage("");
      loadNotices();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      {/* Navbar by role */}
      {role === "Admin" && <AdminNavbar />}
      {role === "Resident" && <ResidentNavbar />}
      {role === "Security" && <SecurityNavbar />}

      <div className="container">
        <h2>Notices</h2>

        {/* Admin-only: Add Notice */}
        {role === "Admin" && (
          <div className="card">
            <h3>Add Notice</h3>
            <form onSubmit={addNotice} className="grid">
              <input
                className="input"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <textarea
                className="input"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <button className="btn">Post Notice</button>
            </form>
          </div>
        )}

        {/* View Notices (All roles) */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>All Notices</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {notices.length === 0 && <p>No notices available.</p>}

          <ul>
            {notices.map((n) => (
              <li key={n._id} style={{ marginBottom: 12 }}>
                <b>{n.title}</b>
                <p style={{ margin: "4px 0", color: "#555" }}>
                  {n.message}
                </p>
                <small style={{ color: "#888" }}>
                  {n.createdAt
                    ? new Date(n.createdAt).toLocaleString()
                    : ""}
                </small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
