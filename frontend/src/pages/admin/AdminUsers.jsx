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
  const [messageType, setMessageType] = useState("");
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [recentUsers, setRecentUsers] = useState([]);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setFlatNo("");
    setRole("Resident");
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("Please fill all required fields.");
      setMessageType("error");
      return;
    }

    if (role === "Resident" && !flatNo.trim()) {
      setMessage("Flat number is required for resident.");
      setMessageType("error");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      };

      if (role === "Resident") {
        payload.flatNo = flatNo.trim().toUpperCase();
      }

      const res = await apiRequest("/api/auth/create-user", "POST", payload);

      setMessage(res?.message || "User created successfully.");
      setMessageType("success");

      const newUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        role,
        flatNo: role === "Resident" ? flatNo.trim().toUpperCase() : "-",
      };

      setRecentUsers((prev) => [newUser, ...prev].slice(0, 5));

      resetForm();
    } catch (e) {
      setMessage(e.message || "Failed to create user.");
      setMessageType("error");
    } finally {
      setCreating(false);
    }
  };

  const residentCount = recentUsers.filter((u) => u.role === "Resident").length;
  const securityCount = recentUsers.filter((u) => u.role === "Security").length;

  return (
    <>
      <AdminNavbar />

      <div className="container">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h2>User Management</h2>
            <p className="subtext">
              Create resident and security accounts for the society portal.
            </p>
          </div>
        </div>

        <div className="admin-users-layout">
          <div className="card admin-user-form-card">
            <h3>Create Resident / Security</h3>
            <p className="subtext">
              Fill the details below to create a new user account.
            </p>

            <form onSubmit={submit} className="admin-user-form">
              <label>Full Name</label>
              <input
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <label className="mt-3">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="form-row mt-3">
                <div>
                  <label>Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="Resident">Resident</option>
                    <option value="Security">Security</option>
                  </select>
                </div>

                {role === "Resident" ? (
                  <div>
                    <label>Flat Number</label>
                    <input
                      placeholder="Example: A-101"
                      value={flatNo}
                      onChange={(e) => setFlatNo(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label>Assignment</label>
                    <input value="Security Staff" disabled />
                  </div>
                )}
              </div>

              <label className="mt-3">Temporary Password</label>
              <div className="admin-password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter temporary password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn secondary admin-password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="row mt-4 admin-user-actions">
                <button className="btn primary" type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create User"}
                </button>

                <button
                  className="btn secondary"
                  type="button"
                  onClick={resetForm}
                >
                  Clear
                </button>
              </div>

              {message && (
                <div className="mt-3">
                  <span className={messageType === "success" ? "badge success" : "badge danger"}>
                    {message}
                  </span>
                </div>
              )}
            </form>
          </div>

          <div className="admin-user-side">
            <div className="card">
              <h3>Quick Summary</h3>

              <div className="grid">
                <div className="card">
                  <div className="muted">Recently Created</div>
                  <h2 style={{ margin: "8px 0 0" }}>{recentUsers.length}</h2>
                </div>

                <div className="card">
                  <div className="muted">Residents</div>
                  <h2 style={{ margin: "8px 0 0" }}>{residentCount}</h2>
                </div>

                <div className="card">
                  <div className="muted">Security</div>
                  <h2 style={{ margin: "8px 0 0" }}>{securityCount}</h2>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Guidelines</h3>
              <div className="admin-user-note">
                <p><strong>Resident:</strong> Must have flat number assigned.</p>
                <p><strong>Security:</strong> No flat number required.</p>
                <p><strong>Password:</strong> Share temporary password securely.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <h3>Recently Created Users</h3>

          {recentUsers.length === 0 ? (
            <p>No users created in this session yet.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Flat No</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge">{user.role}</span>
                      </td>
                      <td>{user.flatNo || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}