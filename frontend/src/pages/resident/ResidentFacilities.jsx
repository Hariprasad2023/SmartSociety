// src/pages/resident/ResidentFacilities.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/api"; // ✅ adjust path if your structure differs
import ResidentNavbar from "../../components/ResidentNavbar"; // ✅ adjust path if needed

export default function ResidentFacilities() {
  const [facility, setFacility] = useState("");
  const [date, setDate] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/facilities"); // GET
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const bookFacility = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      await apiRequest("/api/facilities", "POST", {
        facility,
        date,
      });

      setFacility("");
      setDate("");
      await loadBookings();
    } catch (err) {
      setError(err?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ResidentNavbar />

      <div className="container">
        <h2>Facilities</h2>

        {error && (
          <div className="card" style={{ border: "1px solid #ffb3b3" }}>
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Resident can book facility */}
        <div className="card">
          <h3>Book Facility</h3>

          <form onSubmit={bookFacility} className="grid grid-2">
            <input
              className="input"
              placeholder="Facility (Gym / Hall)"
              value={facility}
              onChange={(e) => setFacility(e.target.value)}
              required
            />

            <input
              className="input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <button className="btn" disabled={loading}>
              {loading ? "Booking..." : "Book"}
            </button>
          </form>
        </div>

        {/* Resident can view bookings */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>My Facility Bookings</h3>

          {loading ? (
            <p>Loading...</p>
          ) : bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Facility</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id}>
                    <td>{b.facility}</td>
                    <td>
                      {b.date ? new Date(b.date).toLocaleDateString() : "-"}
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
