import { useEffect, useState } from "react";
import ResidentNavbar from "../../components/ResidentNavbar";
import { apiRequest } from "../../api/api";

export default function ResidentBills() {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBills = async () => {
      try {
        setError("");
        const data = await apiRequest("/api/bills/my");
        setBills(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e.message);
        setBills([]);
      }
    };

    loadBills();
  }, []);

  return (
    <>
      <ResidentNavbar />
      <div className="container">
        <h2>My Bills</h2>

        <div className="card">
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!error && bills.length === 0 && <p>No bills available.</p>}

          {bills.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((b) => (
                  <tr key={b._id}>
                    <td>{b.month}</td>
                    <td>₹{b.amount}</td>
                    <td>{b.status}</td>
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
