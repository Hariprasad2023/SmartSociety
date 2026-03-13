import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/api";
import { getRole } from "../utils/auth";

import AdminNavbar from "../components/AdminNavbar";
import ResidentNavbar from "../components/ResidentNavbar";
import SecurityNavbar from "../components/SecurityNavbar";

export default function Notices() {
  const role = getRole();
  const isAdmin = role === "Admin";

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [notices, setNotices] = useState([]);

  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  const loadNotices = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/notices");
      setNotices(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load notices");
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotices();
  }, []);

  const addNotice = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !message.trim()) {
      setError("Please fill in title and message.");
      return;
    }

    try {
      setPosting(true);

      await apiRequest("/api/notices", "POST", {
        title: title.trim(),
        message: message.trim(),
      });

      setTitle("");
      setMessage("");
      setSuccess("Notice posted successfully.");
      await loadNotices();
    } catch (e) {
      setError(e.message || "Failed to post notice");
    } finally {
      setPosting(false);
    }
  };

  const filteredNotices = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notices;

    return notices.filter((n) => {
      return (
        String(n.title || "").toLowerCase().includes(q) ||
        String(n.message || "").toLowerCase().includes(q)
      );
    });
  }, [notices, search]);

  const latestNotice = notices.length > 0 ? notices[0] : null;

  return (
    <>
      {role === "Admin" && <AdminNavbar />}
      {role === "Resident" && <ResidentNavbar />}
      {role === "Security" && <SecurityNavbar />}

      <div className="container">
        <div
          className="row"
          style={{ justifyContent: "space-between", marginBottom: 14 }}
        >
          <div>
            <h2>Notices</h2>
            <p className="subtext">
              Stay updated with the latest announcements and important society information.
            </p>
          </div>

          <button
            className="btn secondary"
            type="button"
            onClick={loadNotices}
            style={{ width: "auto" }}
          >
            Refresh
          </button>
        </div>

        <div className="notices-layout">
          {isAdmin && (
            <div className="card notice-form-card">
              <h3>Post Notice</h3>
              <p className="subtext">
                Publish announcements for residents and staff.
              </p>

              <form onSubmit={addNotice} className="notice-form">
                <label>Notice Title</label>
                <input
                  placeholder="Example: Water supply maintenance"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  required
                />
                <div className="muted mt-2">{title.length}/80 characters</div>

                <label className="mt-3">Message</label>
                <textarea
                  rows="6"
                  placeholder="Write the notice message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  required
                />
                <div className="muted mt-2">{message.length}/500 characters</div>

                <div className="row mt-4 notice-form-actions">
                  <button className="btn primary" type="submit" disabled={posting}>
                    {posting ? "Posting..." : "Post Notice"}
                  </button>

                  <button
                    className="btn secondary"
                    type="button"
                    onClick={() => {
                      setTitle("");
                      setMessage("");
                      setError("");
                      setSuccess("");
                    }}
                  >
                    Clear
                  </button>
                </div>

                {(error || success) && (
                  <div className="mt-3">
                    {error && (
                      <p>
                        <span className="badge danger">{error}</span>
                      </p>
                    )}
                    {success && (
                      <p>
                        <span className="badge success">{success}</span>
                      </p>
                    )}
                  </div>
                )}
              </form>
            </div>
          )}

          <div className="notice-side">
            <div className="card">
              <h3>Quick Summary</h3>

              <div className="grid">
                <div className="card">
                  <div className="muted">Total Notices</div>
                  <h2 style={{ margin: "8px 0 0" }}>{notices.length}</h2>
                </div>

                <div className="card">
                  <div className="muted">Visible Results</div>
                  <h2 style={{ margin: "8px 0 0" }}>{filteredNotices.length}</h2>
                </div>
              </div>
            </div>

            {latestNotice && (
              <div className="card">
                <h3>Latest Notice</h3>
                <div className="notice-highlight">
                  <strong>{latestNotice.title}</strong>
                  <p style={{ margin: "10px 0 8px" }}>{latestNotice.message}</p>
                  <span className="muted">
                    {latestNotice.createdAt
                      ? new Date(latestNotice.createdAt).toLocaleString()
                      : ""}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card mt-4">
          <div className="row" style={{ justifyContent: "space-between" }}>
            <div>
              <h3>All Notices</h3>
              <p className="subtext">
                Browse all posted announcements.
              </p>
            </div>
          </div>

          <div className="mt-3">
            <label>Search Notices</label>
            <input
              placeholder="Search by title or message"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="spacer" />

          {!isAdmin && error && (
            <p>
              <span className="badge danger">{error}</span>
            </p>
          )}

          {loading ? (
            <p>Loading notices...</p>
          ) : filteredNotices.length === 0 ? (
            <p>No notices available.</p>
          ) : (
            <div className="notice-list">
              {filteredNotices.map((n) => (
                <div key={n._id} className="notice-item">
                  <div className="notice-item-top">
                    <div>
                      <h3>{n.title}</h3>
                      <span className="badge">Notice</span>
                    </div>
                    <div className="notice-date">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                    </div>
                  </div>

                  <div className="notice-message mt-3">
                    {n.message}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}