import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { apiRequest } from "../../api/api";

export default function AdminBills() {
  const [flatNo, setFlatNo] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");

  // Load all bills (Admin)
  const loadBills = async () => {
    try {
      const data = await apiRequest("/api/bills");
      setBills(data);
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  // Create bill
  const createBill = async (e) => {
    e.preventDefault();
    try {
      await apiRequest("/api/bills", "POST", {
        flatNo,
        month,
        amount
      });
      setFlatNo("");
      setMonth("");
      setAmount("");
      loadBills();
    } catch (e) {
      alert(e.message);
    }
  };

  // Update bill status (Admin)
  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/api/bills/${id}/status`, "PUT", { status });
      loadBills();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container">
        <h2>Bills Management</h2>

        {/* CREATE BILL */}
        <div className="card">
          <h3>Create Bill</h3>
          <form onSubmit={createBill} className="grid grid-2">
            <input
              className="input"
              placeholder="Flat No (A-101)"
              value={flatNo}
              onChange={(e) => setFlatNo(e.target.value)}
              required
            />
            <input
              className="input"
              placeholder="Month (Jan 2026)"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
            <input
              className="input"
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
            <button className="btn">Create Bill</button>
          </form>
        </div>

        {/* VIEW + UPDATE BILLS */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>All Bills</h3>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {bills.length === 0 && <p>No bills found.</p>}

          {bills.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Flat</th>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Paid At</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b._id}>
                    <td>{b.flatNo}</td>
                    <td>{b.month}</td>
                    <td>₹{b.amount}</td>
                    <td>
                      <select
                        className="input"
                        value={b.status}
                        onChange={(e) =>
                          updateStatus(b._id, e.target.value)
                        }
                      >
                        <option value="Unpaid">Unpaid</option>
                        <option value="Paid">Paid</option>
                      </select>
                    </td>
                    <td>
                      {b.paidAt
                        ? new Date(b.paidAt).toLocaleString()
                        : "-"}
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
