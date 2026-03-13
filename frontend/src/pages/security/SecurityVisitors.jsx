import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../api/api";
import SecurityNavbar from "../../components/SecurityNavbar";

const purposeOptions = [
  "Guest Visit",
  "Delivery",
  "Maintenance",
  "Domestic Help",
  "Courier",
  "Cab / Pickup",
  "Event Visit",
  "Other",
];

export default function SecurityVisitors() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    purpose: "Guest Visit",
    flatNo: "",
  });

  const [qrToken, setQrToken] = useState("");
  const [visitors, setVisitors] = useState([]);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadVisitors = async () => {
    try {
      setLoadingList(true);
      setError("");
      const data = await apiRequest("/api/visitors");
      setVisitors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load visitors");
      setVisitors([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetManualForm = () => {
    setForm({
      name: "",
      phone: "",
      purpose: "Guest Visit",
      flatNo: "",
    });
  };

  const addVisitor = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setLoadingAction(true);

      await apiRequest("/api/visitors", "POST", {
        ...form,
        name: form.name.trim(),
        phone: form.phone.trim(),
        flatNo: form.flatNo.trim().toUpperCase(),
      });

      setSuccess("Visitor entry added successfully.");
      resetManualForm();
      await loadVisitors();
    } catch (err) {
      setError(err?.message || "Failed to add visitor");
    } finally {
      setLoadingAction(false);
    }
  };

  const verifyQR = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!qrToken.trim()) {
      setError("Please enter QR token.");
      return;
    }

    try {
      setLoadingAction(true);

      await apiRequest("/api/visitors/verify", "POST", {
        qrToken: qrToken.trim(),
      });

      setSuccess("QR verified successfully. Visitor entry allowed.");
      setQrToken("");
      await loadVisitors();
    } catch (err) {
      setError(err?.message || "QR verification failed");
    } finally {
      setLoadingAction(false);
    }
  };

  const markExit = async (id) => {
    try {
      setLoadingAction(true);
      setError("");
      setSuccess("");

      await apiRequest(`/api/visitors/${id}/exit`, "PUT");

      setSuccess("Visitor exit marked successfully.");
      await loadVisitors();
    } catch (err) {
      setError(err?.message || "Failed to mark exit");
    } finally {
      setLoadingAction(false);
    }
  };

  const getStatusClass = (status) => {
    const s = String(status || "").toUpperCase();
    if (s === "IN") return "badge warn";
    if (s === "OUT") return "badge success";
    if (s === "EXPIRED") return "badge danger";
    return "badge";
  };

  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {
      const matchesStatus =
        statusFilter === "All" ||
        String(v.status || "").toLowerCase() === statusFilter.toLowerCase();

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        String(v.name || "").toLowerCase().includes(q) ||
        String(v.phone || "").toLowerCase().includes(q) ||
        String(v.purpose || "").toLowerCase().includes(q) ||
        String(v.flatNo || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [visitors, search, statusFilter]);

  const totalVisitors = visitors.length;
  const insideVisitors = visitors.filter(
    (v) => String(v.status || "").toUpperCase() === "IN"
  ).length;
  const exitedVisitors = visitors.filter(
    (v) => String(v.status || "").toUpperCase() === "OUT"
  ).length;
  const qrVisitors = visitors.filter((v) => Boolean(v.qrToken)).length;

  return (
    <>
      <SecurityNavbar />

      <div className="container">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h2>Visitor Management</h2>
            <p className="subtext">
              Verify visitor entry, add manual records, and track entry and exit logs.
            </p>
          </div>

          <button
            className="btn secondary"
            onClick={loadVisitors}
            disabled={loadingList || loadingAction}
            style={{ width: "auto" }}
            type="button"
          >
            {loadingList ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="security-visitor-stats">
          <div className="security-visitor-stat-card">
            <span className="security-visitor-stat-label">Total Entries</span>
            <h3>{totalVisitors}</h3>
          </div>

          <div className="security-visitor-stat-card">
            <span className="security-visitor-stat-label">Currently Inside</span>
            <h3>{insideVisitors}</h3>
          </div>

          <div className="security-visitor-stat-card">
            <span className="security-visitor-stat-label">Exited</span>
            <h3>{exitedVisitors}</h3>
          </div>

          <div className="security-visitor-stat-card">
            <span className="security-visitor-stat-label">QR Visitors</span>
            <h3>{qrVisitors}</h3>
          </div>
        </div>

        {(error || success) && (
          <div className="mt-4">
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

        <div className="security-visitor-layout mt-4">
          <div className="card security-qr-card">
            <h3>Allow Visitor Using QR</h3>
            <p className="subtext">
              Verify the resident-generated visitor QR token and allow gate entry.
            </p>

            <form onSubmit={verifyQR} className="security-qr-form">
              <label>QR Token</label>
              <input
                placeholder="Paste or enter QR token"
                value={qrToken}
                onChange={(e) => setQrToken(e.target.value)}
                required
              />

              <div className="row mt-4 security-visitor-actions">
                <button className="btn primary" disabled={loadingAction} type="submit">
                  {loadingAction ? "Verifying..." : "Verify & Allow"}
                </button>

                <button
                  className="btn secondary"
                  type="button"
                  onClick={() => setQrToken("")}
                >
                  Clear
                </button>
              </div>
            </form>

            <div className="security-visitor-note mt-4">
              <strong>How it works</strong>
              <p style={{ margin: "8px 0 0" }}>
                Visitor shows the QR at the gate. Security verifies the token and
                the visitor gets entry if it is valid.
              </p>
            </div>
          </div>

          <div className="card security-manual-card">
            <h3>Add Visitor Manually</h3>
            <p className="subtext">
              Use this when QR is unavailable or when manual entry is required.
            </p>

            <form onSubmit={addVisitor} className="security-manual-form">
              <label>Visitor Name</label>
              <input
                name="name"
                placeholder="Enter visitor name"
                value={form.name}
                onChange={onChange}
                required
              />

              <div className="form-row mt-3">
                <div>
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    placeholder="Enter phone number"
                    value={form.phone}
                    onChange={onChange}
                    required
                  />
                </div>

                <div>
                  <label>Flat Number</label>
                  <input
                    name="flatNo"
                    placeholder="Example: A-101"
                    value={form.flatNo}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <label className="mt-3">Purpose</label>
              <select
                name="purpose"
                value={form.purpose}
                onChange={onChange}
              >
                {purposeOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <div className="row mt-4 security-visitor-actions">
                <button className="btn primary" disabled={loadingAction} type="submit">
                  {loadingAction ? "Saving..." : "Add Entry"}
                </button>

                <button
                  className="btn secondary"
                  type="button"
                  onClick={resetManualForm}
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card mt-4">
          <h3>Recent Entries</h3>
          <p className="subtext">
            View all visitor entries, QR records, and exit status.
          </p>

          <div className="security-visitor-filter-grid mt-3">
            <div>
              <label>Search</label>
              <input
                placeholder="Search by name, phone, flat, purpose"
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
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
                <option value="EXPIRED">EXPIRED</option>
              </select>
            </div>
          </div>

          <div className="spacer" />

          {loadingList ? (
            <p>Loading visitor entries...</p>
          ) : filteredVisitors.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Purpose</th>
                    <th>Flat</th>
                    <th>In Time</th>
                    <th>Out Time</th>
                    <th>Status</th>
                    <th>QR</th>
                    <th>Expiry</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredVisitors.map((v) => {
                    const isInside = String(v.status || "").toUpperCase() === "IN";

                    return (
                      <tr key={v._id}>
                        <td>{v.name || "-"}</td>
                        <td>{v.phone || "-"}</td>
                        <td>
                          {v.purpose ? <span className="badge">{v.purpose}</span> : "-"}
                        </td>
                        <td>{v.flatNo || "-"}</td>
                        <td>{v.inTime ? new Date(v.inTime).toLocaleString() : "-"}</td>
                        <td>{v.outTime ? new Date(v.outTime).toLocaleString() : "-"}</td>
                        <td>
                          <span className={getStatusClass(v.status)}>
                            {v.status || "-"}
                          </span>
                        </td>
                        <td>{v.qrToken ? <span className="badge success">Yes</span> : <span className="badge">No</span>}</td>
                        <td>
                          {v.expiresAt ? new Date(v.expiresAt).toLocaleString() : "-"}
                        </td>
                        <td>
                          {isInside ? (
                            <button
                              className="btn primary"
                              onClick={() => markExit(v._id)}
                              disabled={loadingAction}
                              style={{ width: "auto" }}
                              type="button"
                            >
                              Mark Exit
                            </button>
                          ) : (
                            <span className="muted">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}