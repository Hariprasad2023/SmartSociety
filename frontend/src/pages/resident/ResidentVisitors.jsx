// src/pages/resident/ResidentVisitors.jsx
import { useState } from "react";
import { apiRequest } from "../../api/api";
import ResidentNavbar from "../../components/ResidentNavbar";
import { QRCodeCanvas } from "qrcode.react";

export default function ResidentVisitors() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    flatNo: "",
    purpose: "",
  });

  const [qrToken, setQrToken] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const generateQR = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const res = await apiRequest("/api/visitors/qr", "POST", form);

      setQrToken(res.qrToken);
      setExpiresAt(res.expiresAt);

      // optional: clear form after generation
      setForm({ name: "", phone: "", flatNo: "", purpose: "" });
    } catch (err) {
      setError(err?.message || "Failed to generate QR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResidentNavbar />

      <div className="container">
        <h2>Visitor QR Pass</h2>

        {error && (
          <div className="card" style={{ border: "1px solid #ffb3b3" }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        <div className="card">
          <h3>Generate QR</h3>

          <form onSubmit={generateQR} className="grid grid-2">
            <input
              className="input"
              name="name"
              placeholder="Visitor Name"
              value={form.name}
              onChange={onChange}
              required
            />
            <input
              className="input"
              name="phone"
              placeholder="Visitor Phone"
              value={form.phone}
              onChange={onChange}
              required
            />
            <input
              className="input"
              name="flatNo"
              placeholder="Flat No (e.g., A-101)"
              value={form.flatNo}
              onChange={onChange}
              required
            />
            <input
              className="input"
              name="purpose"
              placeholder="Purpose (e.g., Delivery / Guest)"
              value={form.purpose}
              onChange={onChange}
              required
            />

            <button className="btn" disabled={loading}>
              {loading ? "Generating..." : "Generate QR"}
            </button>
          </form>
        </div>

        {qrToken && (
          <div className="card" style={{ marginTop: 14, textAlign: "center" }}>
            <h3>Show this QR at gate</h3>

            <QRCodeCanvas value={qrToken} size={220} />

            <p style={{ marginTop: 10, fontSize: 13, opacity: 0.85 }}>
              Token: <b>{qrToken}</b>
              <br />
              {expiresAt ? (
                <>
                  Expires: <b>{new Date(expiresAt).toLocaleString()}</b>
                </>
              ) : null}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
