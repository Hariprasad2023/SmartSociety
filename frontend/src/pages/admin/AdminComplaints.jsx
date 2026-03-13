import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { apiRequest } from "../../api/api";

const statusOptions = ["Pending", "In Progress", "Resolved", "Rejected"];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [responses, setResponses] = useState({});

  const loadComplaints = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/complaints");
      setComplaints(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load complaints");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleResponseChange = (id, value) => {
    setResponses((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const updateComplaint = async (complaint, nextStatus) => {
    try {
      setUpdatingId(complaint._id);
      setError("");
      setSuccess("");

      const adminResponse =
        responses[complaint._id] !== undefined
          ? responses[complaint._id]
          : complaint.adminResponse || "";

      await apiRequest(`/api/complaints/${complaint._id}/status`, "PUT", {
        status: nextStatus,
        adminResponse,
      });

      setSuccess("Complaint updated successfully.");
      await loadComplaints();
    } catch (e) {
      setError(e.message || "Failed to update complaint");
    } finally {
      setUpdatingId("");
    }
  };

  const getStatusClass = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "resolved") return "badge success";
    if (s === "in progress") return "badge warn";
    if (s === "rejected") return "badge danger";
    return "badge";
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        String(c.title || "").toLowerCase().includes(q) ||
        String(c.description || "").toLowerCase().includes(q) ||
        String(c.status || "").toLowerCase().includes(q) ||
        String(c?.user?.name || c?.resident?.name || "").toLowerCase().includes(q) ||
        String(c?.flatNumber || c?.user?.flatNumber || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "All" ||
        String(c.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  const totalComplaints = complaints.length;
  const pendingCount = complaints.filter(
    (c) => String(c.status || "").toLowerCase() === "pending"
  ).length;
  const progressCount = complaints.filter(
    (c) => String(c.status || "").toLowerCase() === "in progress"
  ).length;
  const resolvedCount = complaints.filter(
    (c) => String(c.status || "").toLowerCase() === "resolved"
  ).length;

  return (
    <>
      <AdminNavbar />

      <div className="container">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h2>Complaints Management</h2>
            <p className="subtext">
              Review resident complaints and update the resolution status.
            </p>
          </div>

          <button
            className="btn secondary"
            type="button"
            onClick={loadComplaints}
            style={{ width: "auto" }}
          >
            Refresh
          </button>
        </div>

        <div className="admin-complaint-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total</span>
            <h3>{totalComplaints}</h3>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Pending</span>
            <h3>{pendingCount}</h3>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">In Progress</span>
            <h3>{progressCount}</h3>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Resolved</span>
            <h3>{resolvedCount}</h3>
          </div>
        </div>

        <div className="card admin-filter-card mt-4">
          <div className="admin-filter-grid">
            <div>
              <label>Search</label>
              <input
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(error || success) && (
            <div className="mt-3">
              {error && <span className="badge danger">{error}</span>}
              {success && <span className="badge success">{success}</span>}
            </div>
          )}
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="card">
              <p>Loading complaints...</p>
            </div>
          ) : filteredComplaints.length === 0 ? (
            <div className="card">
              <p>No complaints found.</p>
            </div>
          ) : (
            <div className="admin-complaints-list">
              {filteredComplaints.map((c) => {
                const residentName =
                  c?.resident?.name || c?.user?.name || c?.userId?.name || "Resident";
                const flatNumber =
                  c?.resident?.flatNumber ||
                  c?.user?.flatNumber ||
                  c?.userId?.flatNumber ||
                  c?.flatNumber ||
                  "-";

                return (
                  <div key={c._id} className="admin-complaint-item">
                    <div className="admin-complaint-main">
                      <div className="admin-complaint-top">
                        <div>
                          <h3>{c.title}</h3>
                          <div className="row">
                            <span className={getStatusClass(c.status)}>
                              {c.status || "Pending"}
                            </span>
                            {c.category && <span className="badge">{c.category}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="admin-complaint-info mt-3">
                        <span><strong>Resident:</strong> {residentName}</span>
                        <span><strong>Flat:</strong> {flatNumber}</span>
                        {c.createdAt && (
                          <span>
                            <strong>Date:</strong> {new Date(c.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="admin-description-box mt-3">
                        {c.description || "No description available."}
                      </div>
                    </div>

                    <div className="admin-complaint-sidepanel">
                      <div>
                        <label>Update Status</label>
                        <select
                          value={c.status || "Pending"}
                          onChange={(e) => updateComplaint(c, e.target.value)}
                          disabled={updatingId === c._id}
                        >
                          {statusOptions.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mt-3">
                        <label>Admin Response</label>
                        <textarea
                          rows="5"
                          placeholder="Write a response..."
                          value={
                            responses[c._id] !== undefined
                              ? responses[c._id]
                              : c.adminResponse || ""
                          }
                          onChange={(e) => handleResponseChange(c._id, e.target.value)}
                        />
                      </div>

                      <button
                        className="btn primary mt-4"
                        type="button"
                        onClick={() => updateComplaint(c, c.status || "Pending")}
                        disabled={updatingId === c._id}
                      >
                        {updatingId === c._id ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}