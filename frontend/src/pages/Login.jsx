import { useState } from "react";
import { apiRequest } from "../api/api";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const data = await apiRequest("/api/auth/login", "POST", {
        email,
        password
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "Admin") window.location.href = "/admin";
      else if (data.role === "Resident") window.location.href = "/resident";
      else if (data.role === "Security") window.location.href = "/security";
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "80px auto" }}>
      <div className="card">
        <h2>SmartSociety Login</h2>

        <form onSubmit={handleSubmit} className="grid">
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn">Login</button>
        </form>

        {err && <p style={{ color: "red" }}>{err}</p>}
      </div>
    
<div style={{ marginTop: 16, textAlign: "center" }}>
  <p style={{ marginBottom: 6 }}>Just visiting?</p>

  <Link
    to="/guest"
    style={{
      textDecoration: "none",
      color: "#2563eb",
      fontWeight: "bold",
    }}
  >
    Continue as Guest →
  </Link>
</div>
    </div>
  );
}
