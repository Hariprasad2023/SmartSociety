import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import AdminNavbar from "../components/AdminNavbar";
import ResidentNavbar from "../components/ResidentNavbar";
import { getRole } from "../utils/auth";

export default function Facilities() {
  const role = getRole();

  const [facility, setFacility] = useState("");
  const [date, setDate] = useState("");
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    const data = await apiRequest("/api/facilities");
    setBookings(data);
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const bookFacility = async (e) => {
    e.preventDefault();
    await apiRequest("/api/facilities", "POST", {
      facility,
      date
    });
    setFacility("");
    setDate("");
    loadBookings();
  };

  return (
    <>
      {/* Navbar based on role */}
      {role === "Admin" && <AdminNavbar />}
      {role === "Resident" && <ResidentNavbar />}

      <div className="container">
        <h2>Facilities</h2>

        {/* Resident can book facility */}
        {role === "Resident" && (
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
              <button className="btn">Book</button>
            </form>
          </div>
        )}

        {/* Admin + Resident can view bookings */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Facility Bookings</h3>

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
                  <td>{new Date(b.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {bookings.length === 0 && <p>No bookings found.</p>}
        </div>
      </div>
    </>
  );
}
