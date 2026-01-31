import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api";
import SecurityNavbar from "../../components/SecurityNavbar";

export default function SecurityVisitors() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    purpose: "",
    flatNo: "",
  });

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadVisitors = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/visitors");
      setVisitors(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addVisitor = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      await apiRequest("/api/visitors", "POST", form);
      setForm({ name: "", phone: "", purpose: "", flatNo: "" });
      await loadVisitors();
    } catch (err) {
      setError(err?.message || "Failed to add visitor");
    } finally {
      setLoading(false);
    }
  };

  const markExit = async (id) => {
    try {
      setLoading(true);
      setError("");
      await apiRequest(`/api/visitors/${id}/exit`, "PUT");
      await loadVisitors();
    } catch (err) {
      setError(err?.message || "Failed to mark exit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SecurityNavbar />

      <div className="container">
        <h2>Visitor Management</h2>

        {error && (
          <div className="card" style={{ border: "1px solid #ffb3b3" }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        <div className="card">
          <h3>Add Visitor</h3>
          <form onSubmit={addVisitor} className="grid grid-2">
            <input className="input" name="name" placeholder="Name" value={form.name} onChange={onChange} required />
            <input className="input" name="phone" placeholder="Phone" value={form.phone} onChange={onChange} required />
            <input className="input" name="purpose" placeholder="Purpose" value={form.purpose} onChange={onChange} required />
            <input className="input" name="flatNo" placeholder="Flat No" value={form.flatNo} onChange={onChange} required />
            <button className="btn" disabled={loading}>{loading ? "Saving..." : "Add Entry"}</button>
          </form>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h3>Recent Entries</h3>

          {loading ? (
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map((v) => (
                  <tr key={v._id}>
                    <td>{v.name}</td>
                    <td>{v.phone}</td>
                    <td>{v.purpose}</td>
                    <td>{v.flatNo}</td>
                    <td>{v.inTime ? new Date(v.inTime).toLocaleString() : "-"}</td>
                    <td>{v.outTime ? new Date(v.outTime).toLocaleString() : "-"}</td>
                    <td>{v.status}</td>
                    <td>
                      {v.status === "IN" ? (
                        <button className="btn" onClick={() => markExit(v._id)}>
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
