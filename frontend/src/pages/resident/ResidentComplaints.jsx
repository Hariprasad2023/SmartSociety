import { useEffect, useMemo, useState } from "react";
import ResidentNavbar from "../../components/ResidentNavbar";
import { apiRequest } from "../../api/api";

const complaintCategories = [
  "Water",
  "Electricity",
  "Security",
  "Cleanliness",
  "Lift",
  "Parking",
  "Noise",
  "Maintenance",
  "Billing",
  "Other",
];

const priorityOptions = ["Low", "Medium", "High"];

export default function ResidentComplaints() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Maintenance");
  const [priority, setPriority] = useState("Medium");

  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/complaints/my");
      setComplaints(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Maintenance");
    setPriority("Medium");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim() || !description.trim()) {
      setError("Please fill in title and description.");
      return;
    }

    try {
      setSubmitting(true);

      await apiRequest("/api/complaints", "POST", {
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
      });

      setSuccess("Complaint submitted successfully.");
      resetForm();
      await load();
    } catch (e) {
      setError(e.message || "Failed to submit complaint");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    const s = String(status || "").toLowerCase();

    if (s === "resolved") return "badge success";
    if (s === "in progress" || s === "pending") return "badge warn";
    if (s === "rejected" || s === "closed") return "badge danger";
    return "badge";
  };

  const getPriorityClass = (value) => {
    const p = String(value || "").toLowerCase();

    if (p === "high") return "badge danger";
    if (p === "medium") return "badge warn";
    if (p === "low") return "badge success";
    return "badge";
  };

  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      const matchesStatus =
        filterStatus === "All" ||
        String(c.status || "").toLowerCase() === filterStatus.toLowerCase();

      const matchesCategory =
        filterCategory === "All" ||
        String(c.category || "").toLowerCase() === filterCategory.toLowerCase();

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        String(c.title || "").toLowerCase().includes(q) ||
        String(c.description || "").toLowerCase().includes(q);

      return matchesStatus && matchesCategory && matchesSearch;
    });
  }, [complaints, filterStatus, filterCategory, search]);

  return (
    <>
      <ResidentNavbar />

      <div className="container">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h2>My Complaints</h2>
            <p className="subtext">Raise issues and track their progress easily.</p>
          </div>
          <button className="btn secondary" onClick={load} type="button" style={{ width: "auto" }}>
            Refresh
          </button>
        </div>

        <div className="complaints-layout">
          <div className="card complaint-form-card">
            <h3>Register Complaint</h3>
            <p className="subtext">
              Share the issue clearly so management can resolve it faster.
            </p>

            <form onSubmit={submit} className="complaint-form">
              <label>Complaint Title</label>
              <input
                placeholder="Example: Water leakage in kitchen"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={80}
                required
              />
              <div className="muted mt-2">{title.length}/80 characters</div>

              <div className="form-row mt-3">
                <div>
                  <label>Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {complaintCategories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label>Priority</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    {priorityOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="mt-3">Description</label>
              <textarea
                rows="5"
                placeholder="Explain the issue clearly..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                required
              />
              <div className="muted mt-2">{description.length}/300 characters</div>

              <div className="row mt-4 complaint-actions">
                <button className="btn primary" type="submit" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
                <button className="btn secondary" type="button" onClick={resetForm}>
                  Clear
                </button>
              </div>

              {success && (
                <p className="mt-3">
                  <span className="badge success">{success}</span>
                </p>
              )}

              {error && (
                <p className="mt-3">
                  <span className="badge danger">{error}</span>
                </p>
              )}
            </form>
          </div>

          <div className="complaint-side">
            <div className="card">
              <h3>Quick Summary</h3>
              <div className="grid">
                <div className="card">
                  <div className="muted">Total Complaints</div>
                  <h2 style={{ margin: "8px 0 0" }}>{complaints.length}</h2>
                </div>

                <div className="card">
                  <div className="muted">Pending / In Progress</div>
                  <h2 style={{ margin: "8px 0 0" }}>
                    {
                      complaints.filter((c) =>
                        ["pending", "in progress"].includes(String(c.status || "").toLowerCase())
                      ).length
                    }
                  </h2>
                </div>

                <div className="card">
                  <div className="muted">Resolved</div>
                  <h2 style={{ margin: "8px 0 0" }}>
                    {
                      complaints.filter(
                        (c) => String(c.status || "").toLowerCase() === "resolved"
                      ).length
                    }
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <h3>Complaint History</h3>
          <p className="subtext">Filter and review all your submitted complaints.</p>

          <div className="form-row mt-3">
            <div>
              <label>Search</label>
              <input
                placeholder="Search by title or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label>Status Filter</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label>Category Filter</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All</option>
              {complaintCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="spacer" />

          {loading ? (
            <p>Loading complaints...</p>
          ) : filteredComplaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <div className="grid">
              {filteredComplaints.map((c) => (
                <div key={c._id} className="card">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ marginBottom: 6 }}>{c.title}</h3>
                      <div className="row">
                        <span className={getStatusClass(c.status)}>{c.status || "Pending"}</span>
                        <span className="badge">{c.category || "General"}</span>
                        <span className={getPriorityClass(c.priority)}>
                          {c.priority || "Medium"} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3">{c.description}</p>

                  <div className="row mt-3">
                    {c.createdAt && (
                      <span className="muted">
                        Submitted: {new Date(c.createdAt).toLocaleString()}
                      </span>
                    )}
                    {c.updatedAt && (
                      <span className="muted">
                        Updated: {new Date(c.updatedAt).toLocaleString()}
                      </span>
                    )}
                  </div>

                  {c.adminResponse && (
                    <div
                      className="mt-3 p-3"
                      style={{
                        background: "rgba(91,77,247,0.06)",
                        border: "1px solid rgba(91,77,247,0.10)",
                        borderRadius: 12,
                      }}
                    >
                      <strong>Admin Response:</strong>
                      <p style={{ marginTop: 8 }}>{c.adminResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}