import { useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { apiRequest } from "../../api/api";

export default function AdminUsers() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Resident");
  const [flatNo, setFlatNo] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const payload = {
        name,
        email,
        password,
        role
      };

      // Flat number only for Resident
      if (role === "Resident") {
        payload.flatNo = flatNo;
      }

      const res = await apiRequest("/api/auth/create-user", "POST", payload);

      setMessage(res.message);

      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setFlatNo("");
      setRole("Resident");
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container">
        <h2>User Management</h2>

        <div className="card">
          <h3>Create Resident / Security</h3>

          <form onSubmit={submit} className="grid">
            <input
              className="input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              className="input"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="input"
              type="password"
              placeholder="Temporary Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Resident">Resident</option>
              <option value="Security">Security</option>
            </select>

            {/* Flat number only for Resident */}
            {role === "Resident" && (
              <input
                className="input"
                placeholder="Flat No (A-101)"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                required
              />
            )}

            <button className="btn">Create User</button>
          </form>

          {message && (
            <p style={{ marginTop: 12, fontWeight: "bold" }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
