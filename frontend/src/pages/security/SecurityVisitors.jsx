import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import SecurityNavbar from "../../components/SecurityNavbar";

export default function SecurityVisitors() {
  // Manual entry form (optional)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    purpose: "",
    flatNo: "",
  });

  // QR verification
  const [qrToken, setQrToken] = useState("");

  const [visitors, setVisitors] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [error, setError] = useState("");

  const loadVisitors = async () => {
    try {
      setLoadingList(true);
      setError("");
      const data = await apiRequest("/api/visitors");
      setVisitors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load visitors");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Manual entry (keep if you want)
  const addVisitor = async (e) => {
    e.preventDefault();
    try {
      setLoadingAction(true);
      setError("");

      await apiRequest("/api/visitors", "POST", form);

      setForm({ name: "", phone: "", purpose: "", flatNo: "" });
      await loadVisitors();
    } catch (err) {
      setError(err?.message || "Failed to add visitor");
    } finally {
      setLoadingAction(false);
    }
  };

  // ✅ QR Verify (Allow Entry)
  const verifyQR = async (e) => {
    e.preventDefault();
    if (!qrToken.trim()) {
      setError("Please enter QR token");
      return;
    }

    try {
      setLoadingAction(true);
      setError("");

      // Backend should set status IN and inTime when valid
      await apiRequest("/api/visitors/verify", "POST", { qrToken: qrToken.trim() });

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
      await apiRequest(`/api/visitors/${id}/exit`, "PUT");
      await loadVisitors();
    } catch (err) {
      setError(err?.message || "Failed to mark exit");
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <>
      <SecurityNavbar />

      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Visitor Management</h2>
          <button className="btn secondary" onClick={loadVisitors} disabled={loadingList || loadingAction}>
            {loadingList ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && (
          <div className="card" style={{ border: "1px solid #ffb3b3" }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {/* ✅ QR Allow Entry */}
        <div className="card">
          <h3>Allow Visitor (QR)</h3>
          <form onSubmit={verifyQR} className="grid grid-2">
            <input
              className="input"
              placeholder="Paste/Enter QR Token"
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              required
            />
            <button className="btn" disabled={loadingAction}>
              {loadingAction ? "Verifying..." : "Verify & Allow"}
            </button>
          </form>
          <p style={{ marginTop: 8, opacity: 0.8, fontSize: 13 }}>
            Visitor shows QR at gate → you verify token → entry is allowed.
          </p>
        </div>

        {/* ✅ Optional: Manual entry */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Add Visitor (Manual)</h3>
          <form onSubmit={addVisitor} className="grid grid-2">
            <input
              className="input"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={onChange}
              required
            />
            <input
              className="input"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={onChange}
              required
            />
            <input
              className="input"
              name="purpose"
              placeholder="Purpose"
              value={form.purpose}
              onChange={onChange}
              required
            />
            <input
              className="input"
              name="flatNo"
              placeholder="Flat No"
              value={form.flatNo}
              onChange={onChange}
              required
            />
            <button className="btn" disabled={loadingAction}>
              {loadingAction ? "Saving..." : "Add Entry"}
            </button>
          </form>
        </div>

        {/* Visitor list */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Recent Entries</h3>

          {loadingList ? (
            <p>Loading...</p>
          ) : visitors.length === 0 ? (
            <p>No entries found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Purpose</th>
                  <th>Flat</th>
                  <th>In</th>
                  <th>Out</th>
                  <th>Status</th>
                  <th>QR</th>
                  <th>Expiry</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {visitors.map((v) => (
                  <tr key={v._id}>
                    <td>{v.name || "-"}</td>
                    <td>{v.phone || "-"}</td>
                    <td>{v.purpose || "-"}</td>
                    <td>{v.flatNo || "-"}</td>
                    <td>{v.inTime ? new Date(v.inTime).toLocaleString() : "-"}</td>
                    <td>{v.outTime ? new Date(v.outTime).toLocaleString() : "-"}</td>
                    <td>{v.status || "-"}</td>
                    <td>{v.qrToken ? "Yes" : "No"}</td>
                    <td>{v.expiresAt ? new Date(v.expiresAt).toLocaleString() : "-"}</td>
                    <td>
                      {v.status === "IN" ? (
                        <button
                          className="btn"
                          onClick={() => markExit(v._id)}
                          disabled={loadingAction}
                        >
                          Mark Exit
                        </button>
                      ) : (
                        "-"
                      )}
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
