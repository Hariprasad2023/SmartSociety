import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { apiRequest } from "../../api/api";

export default function AdminBills() {
  const [flatNo, setFlatNo] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadBills = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/bills");
      setBills(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load bills");
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const resetForm = () => {
    setFlatNo("");
    setMonth("");
    setAmount("");
  };

  const formatMonth = (value) => {
    if (!value) return "";
    const [year, monthNum] = value.split("-");
    const date = new Date(`${year}-${monthNum}-01`);
    return date.toLocaleString("en-IN", {
      month: "short",
      year: "numeric",
    });
  };

  const createBill = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!flatNo.trim() || !month || !amount) {
      setError("Please fill all bill details.");
      return;
    }

    try {
      setCreating(true);

      await apiRequest("/api/bills", "POST", {
        flatNo: flatNo.trim().toUpperCase(),
        month: formatMonth(month),
        amount: Number(amount),
      });

      setSuccess("Bill created successfully.");
      resetForm();
      await loadBills();
    } catch (e) {
      setError(e.message || "Failed to create bill");
    } finally {
      setCreating(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      setError("");
      setSuccess("");

      await apiRequest(`/api/bills/${id}/status`, "PUT", { status });

      setSuccess("Bill status updated successfully.");
      await loadBills();
    } catch (e) {
      setError(e.message || "Failed to update bill status");
    } finally {
      setUpdatingId("");
    }
  };

  const getStatusClass = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "paid") return "badge success";
    if (s === "unpaid") return "badge warn";
    if (s === "overdue") return "badge danger";
    return "badge";
  };

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const matchesStatus =
        statusFilter === "All" ||
        String(b.status || "").toLowerCase() === statusFilter.toLowerCase();

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        String(b.flatNo || "").toLowerCase().includes(q) ||
        String(b.month || "").toLowerCase().includes(q) ||
        String(b.status || "").toLowerCase().includes(q) ||
        String(b.amount || "").toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [bills, search, statusFilter]);

  const totalBills = bills.length;
  const paidBills = bills.filter(
    (b) => String(b.status || "").toLowerCase() === "paid"
  ).length;
  const unpaidBills = bills.filter(
    (b) => String(b.status || "").toLowerCase() === "unpaid"
  ).length;
  const totalCollection = bills
    .filter((b) => String(b.status || "").toLowerCase() === "paid")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  return (
    <>
      <AdminNavbar />

      <div className="container">
        <div
          className="row"
          style={{ justifyContent: "space-between", marginBottom: 14 }}
        >
          <div>
            <h2>Bills Management</h2>
            <p className="subtext">
              Create maintenance bills, track payments, and update bill status.
            </p>
          </div>

          <button
            className="btn secondary"
            type="button"
            onClick={loadBills}
            style={{ width: "auto" }}
          >
            Refresh
          </button>
        </div>

        <div className="admin-bill-stats">
          <div className="admin-bill-stat-card">
            <span className="admin-bill-stat-label">Total Bills</span>
            <h3>{totalBills}</h3>
          </div>

          <div className="admin-bill-stat-card">
            <span className="admin-bill-stat-label">Paid</span>
            <h3>{paidBills}</h3>
          </div>

          <div className="admin-bill-stat-card">
            <span className="admin-bill-stat-label">Unpaid</span>
            <h3>{unpaidBills}</h3>
          </div>

          <div className="admin-bill-stat-card">
            <span className="admin-bill-stat-label">Collected</span>
            <h3>₹{totalCollection}</h3>
          </div>
        </div>

        <div className="admin-bills-layout mt-4">
          <div className="card admin-create-bill-card">
            <h3>Create Bill</h3>
            <p className="subtext">
              Generate a new bill for a resident flat.
            </p>

            <form onSubmit={createBill} className="admin-bill-form">
              <label>Flat Number</label>
              <input
                placeholder="Example: A-101"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                required
              />

              <div className="form-row mt-3">
                <div>
                  <label>Billing Month</label>
                  <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="row mt-4 admin-bill-form-actions">
                <button className="btn primary" type="submit" disabled={creating}>
                  {creating ? "Creating..." : "Create Bill"}
                </button>

                <button
                  className="btn secondary"
                  type="button"
                  onClick={resetForm}
                >
                  Clear
                </button>
              </div>

              {(error || success) && (
                <div className="mt-3">
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
            </form>
          </div>

          <div className="card admin-bills-filter-card">
            <h3>Filter Bills</h3>
            <p className="subtext">
              Search bills by flat number, month, amount, or status.
            </p>

            <label>Search</label>
            <input
              placeholder="Search bills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <label className="mt-3">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
              <option value="Overdue">Overdue</option>
            </select>

            <div className="mt-4 admin-filter-note">
              <strong>Tip:</strong>
              <p style={{ margin: "8px 0 0" }}>
                Mark a bill as paid only after payment has been confirmed.
              </p>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <h3>All Bills</h3>
          <p className="subtext">
            Review all generated bills and update payment status.
          </p>

          {loading ? (
            <p>Loading bills...</p>
          ) : filteredBills.length === 0 ? (
            <p>No bills found.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Flat</th>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Paid At</th>
                    <th>Update</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBills.map((b) => (
                    <tr key={b._id}>
                      <td>{b.flatNo || "-"}</td>
                      <td>{b.month || "-"}</td>
                      <td>₹{b.amount || 0}</td>
                      <td>
                        <span className={getStatusClass(b.status)}>
                          {b.status || "Unpaid"}
                        </span>
                      </td>
                      <td>
                        {b.paidAt ? new Date(b.paidAt).toLocaleString() : "-"}
                      </td>
                      <td>
                        <select
                          value={b.status || "Unpaid"}
                          onChange={(e) => updateStatus(b._id, e.target.value)}
                          disabled={updatingId === b._id}
                        >
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                          <option value="Overdue">Overdue</option>
                        </select>
                      </td>
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