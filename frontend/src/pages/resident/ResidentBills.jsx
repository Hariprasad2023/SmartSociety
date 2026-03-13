import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import ResidentNavbar from "../../components/ResidentNavbar";
import { apiRequest } from "../../api/api";

export default function ResidentBills() {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedBill, setSelectedBill] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const loadBills = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/bills/my");
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

  const openPaymentModal = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setSelectedBill(null);
    setShowPaymentModal(false);
  };

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const matchesStatus =
        statusFilter === "All" ||
        String(b.status || "").toLowerCase() === statusFilter.toLowerCase();

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
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
    (b) => String(b.status || "").toLowerCase() !== "paid"
  ).length;
  const totalPendingAmount = bills
    .filter((b) => String(b.status || "").toLowerCase() !== "paid")
    .reduce((sum, b) => sum + Number(b.amount || 0), 0);

  const getStatusClass = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "paid") return "badge success";
    if (s === "pending" || s === "unpaid") return "badge warn";
    if (s === "overdue") return "badge danger";
    return "badge";
  };

  const getPaymentText = (bill) => {
    const societyUpiId = "smartsociety@upi";
    const payeeName = "Smart Society";
    const amount = Number(bill?.amount || 0);
    const month = bill?.month || "Bill Payment";

    return `upi://pay?pa=${societyUpiId}&pn=${encodeURIComponent(
      payeeName
    )}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Maintenance bill - ${month}`)}`;
  };

  return (
    <>
      <ResidentNavbar />

      <div className="container">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h2>My Bills</h2>
            <p className="subtext">
              View your maintenance bills and pay pending dues.
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

        <div className="grid grid-3">
          <div className="card">
            <div className="muted">Total Bills</div>
            <h2 style={{ margin: "8px 0 0" }}>{totalBills}</h2>
          </div>

          <div className="card">
            <div className="muted">Paid Bills</div>
            <h2 style={{ margin: "8px 0 0" }}>{paidBills}</h2>
          </div>

          <div className="card">
            <div className="muted">Pending Amount</div>
            <h2 style={{ margin: "8px 0 0" }}>₹{totalPendingAmount}</h2>
          </div>
        </div>

        <div className="card mt-4">
          <h3>Filter Bills</h3>

          <div className="form-row mt-3">
            <div>
              <label>Search</label>
              <input
                placeholder="Search by month, amount, or status"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <h3>Bill History</h3>

          {error && (
            <p className="mt-3">
              <span className="badge danger">{error}</span>
            </p>
          )}

          {!error && loading && <p>Loading bills...</p>}

          {!error && !loading && bills.length === 0 && <p>No bills available.</p>}

          {!error && !loading && filteredBills.length > 0 && (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBills.map((b) => {
                    const isPaid = String(b.status || "").toLowerCase() === "paid";

                    return (
                      <tr key={b._id}>
                        <td>{b.month || "-"}</td>
                        <td>₹{b.amount || 0}</td>
                        <td>
                          <span className={getStatusClass(b.status)}>
                            {b.status || "Pending"}
                          </span>
                        </td>
                        <td>
                          {isPaid ? (
                            <span className="badge success">Already Paid</span>
                          ) : (
                            <button
                              className="btn primary"
                              type="button"
                              onClick={() => openPaymentModal(b)}
                              style={{ width: "auto" }}
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!error && !loading && filteredBills.length === 0 && bills.length > 0 && (
            <p>No matching bills found.</p>
          )}
        </div>
      </div>

      {showPaymentModal && selectedBill && (
        <div className="payment-modal-backdrop" onClick={closePaymentModal}>
          <div
            className="payment-modal card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 style={{ marginBottom: 6 }}>Pay Bill</h3>
                <p className="subtext" style={{ marginTop: 0 }}>
                  Complete payment using the QR code below.
                </p>
              </div>

              <button
                className="btn secondary"
                type="button"
                onClick={closePaymentModal}
                style={{ width: "auto" }}
              >
                Close
              </button>
            </div>

            <div className="payment-details mt-3">
              <div className="row">
                <span className="badge">{selectedBill.month || "Bill"}</span>
                <span className="badge warn">₹{selectedBill.amount || 0}</span>
                <span className={getStatusClass(selectedBill.status)}>
                  {selectedBill.status || "Pending"}
                </span>
              </div>
            </div>

            <div className="qr-box mt-4">
              <QRCode
                value={getPaymentText(selectedBill)}
                size={180}
                style={{ height: "auto", maxWidth: "100%", width: "180px" }}
              />
            </div>

            <div className="mt-3">
              <p className="muted" style={{ marginBottom: 8 }}>
                Scan this QR using any UPI app to pay the bill.
              </p>

              <div className="manual-payment-box">
                <strong>Manual Payment Option</strong>
                <p style={{ margin: "8px 0 0" }}>
                  If QR payment is not working, please pay manually to the society
                  office and inform the admin after payment.
                </p>
              </div>
            </div>

            <div className="row mt-4 payment-modal-actions">
              <button className="btn secondary" type="button" onClick={closePaymentModal}>
                I Will Pay Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}