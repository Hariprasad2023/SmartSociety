import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../api/api";
import ResidentNavbar from "../../components/ResidentNavbar";

const facilityOptions = [
  "Community Hall",
  "Gym",
  "Swimming Pool",
  "Club House",
  "Meeting Room",
  "Badminton Court",
  "Parking Slot",
  "Garden Area",
];

const slotOptions = [
  "06:00 AM - 07:00 AM",
  "07:00 AM - 08:00 AM",
  "08:00 AM - 09:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
  "06:00 PM - 08:00 PM",
  "08:00 PM - 10:00 PM",
];

export default function ResidentFacilities() {
  const [facility, setFacility] = useState("Community Hall");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("06:00 AM - 07:00 AM");
  const [purpose, setPurpose] = useState("");

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [filterFacility, setFilterFacility] = useState("All");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiRequest("/api/facilities");
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

  const resetForm = () => {
    setFacility("Community Hall");
    setDate("");
    setSlot("06:00 AM - 07:00 AM");
    setPurpose("");
  };

  const bookFacility = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!facility || !date) {
      setError("Please select facility and date.");
      return;
    }

    try {
      setSubmitting(true);

      await apiRequest("/api/facilities", "POST", {
        facility,
        date,
        slot,
        purpose: purpose.trim(),
      });

      setSuccess("Facility booked successfully.");
      resetForm();
      await loadBookings();
    } catch (err) {
      setError(err?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesFacility =
        filterFacility === "All" ||
        String(b.facility || "").toLowerCase() === filterFacility.toLowerCase();

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        String(b.facility || "").toLowerCase().includes(q) ||
        String(b.slot || "").toLowerCase().includes(q) ||
        String(b.purpose || "").toLowerCase().includes(q);

      return matchesFacility && matchesSearch;
    });
  }, [bookings, search, filterFacility]);

  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <>
      <ResidentNavbar />

      <div className="container">
        <div
          className="row"
          style={{ justifyContent: "space-between", marginBottom: 12 }}
        >
          <div>
            <h2>Facilities</h2>
            <p className="subtext">
              Book society facilities and manage your reservations easily.
            </p>
          </div>

          <button
            className="btn secondary"
            onClick={loadBookings}
            type="button"
            style={{ width: "auto" }}
          >
            Refresh
          </button>
        </div>

        <div className="facilities-layout">
          <div className="card facility-form-card">
            <h3>Book Facility</h3>
            <p className="subtext">
              Choose the facility, date, and time slot for your booking.
            </p>

            <form onSubmit={bookFacility} className="facility-form">
              <label>Facility</label>
              <select
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                required
              >
                {facilityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <div className="form-row mt-3">
                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    min={todayDate}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label>Time Slot</label>
                  <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                    {slotOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="mt-3">Purpose</label>
              <textarea
                rows="4"
                placeholder="Example: Family function, meeting, personal workout..."
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                maxLength={150}
              />
              <div className="muted mt-2">{purpose.length}/150 characters</div>

              <div className="row mt-4 facility-actions">
                <button className="btn primary" type="submit" disabled={submitting}>
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>

                <button
                  className="btn secondary"
                  type="button"
                  onClick={resetForm}
                >
                  Clear
                </button>
              </div>

              {success && (
                <p className="mt-3">
                  <span className="badge success">{success}</span>
                </p>
              )}

              {error && (
                <p className="mt-3">
                  <span className="badge danger">{error}</span>
                </p>
              )}
            </form>
          </div>

          <div className="facility-side">
            <div className="card">
              <h3>Quick Summary</h3>

              <div className="grid">
                <div className="card">
                  <div className="muted">Total Bookings</div>
                  <h2 style={{ margin: "8px 0 0" }}>{bookings.length}</h2>
                </div>

                <div className="card">
                  <div className="muted">Upcoming</div>
                  <h2 style={{ margin: "8px 0 0" }}>
                    {
                      bookings.filter((b) => {
                        if (!b.date) return false;
                        return new Date(b.date) >= new Date(new Date().setHours(0, 0, 0, 0));
                      }).length
                    }
                  </h2>
                </div>

                <div className="card">
                  <div className="muted">Facility Types Used</div>
                  <h2 style={{ margin: "8px 0 0" }}>
                    {new Set(bookings.map((b) => b.facility).filter(Boolean)).size}
                  </h2>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Popular Facilities</h3>
              <div className="row">
                {facilityOptions.slice(0, 5).map((item) => (
                  <span key={item} className="badge">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <h3>My Facility Bookings</h3>
          <p className="subtext">
            Search and filter your past and upcoming reservations.
          </p>

          <div className="form-row mt-3">
            <div>
              <label>Search</label>
              <input
                placeholder="Search by facility, slot, or purpose"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <label>Facility Filter</label>
              <select
                value={filterFacility}
                onChange={(e) => setFilterFacility(e.target.value)}
              >
                <option value="All">All</option>
                {facilityOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="spacer" />

          {loading ? (
            <p>Loading bookings...</p>
          ) : filteredBookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <div className="grid">
              {filteredBookings.map((b) => (
                <div key={b._id} className="card">
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ marginBottom: 6 }}>{b.facility || "Facility Booking"}</h3>
                      <div className="row">
                        <span className="badge">
                          {b.date ? new Date(b.date).toLocaleDateString() : "No Date"}
                        </span>
                        <span className="badge success">{b.slot || "General Slot"}</span>
                      </div>
                    </div>
                  </div>

                  {b.purpose && <p className="mt-3">{b.purpose}</p>}

                  <div className="row mt-3">
                    {b.createdAt && (
                      <span className="muted">
                        Booked On: {new Date(b.createdAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}