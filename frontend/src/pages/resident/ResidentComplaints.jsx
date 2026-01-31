import { useEffect, useState } from "react";
import ResidentNavbar from "../../components/ResidentNavbar";
import { apiRequest } from "../../api/api";

export default function ResidentComplaints() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await apiRequest("/api/complaints/my");
      setComplaints(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await apiRequest("/api/complaints", "POST", { title, description });
      setTitle("");
      setDescription("");
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <ResidentNavbar />
      <div className="container">
        <h2>My Complaints</h2>

        <div className="card">
          <h3>Add Complaint</h3>
          <form onSubmit={submit} className="grid">
            <input className="input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <button className="btn">Submit</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h3>Complaint History</h3>
          {complaints.length === 0 ? (
            <p>No complaints yet.</p>
          ) : (
            <ul>
              {complaints.map((c) => (
                <li key={c._id}>
                  <b>{c.title}</b> — {c.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
