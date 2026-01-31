import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Facilities() {
  const [items, setItems] = useState([
    { id: 1, name: "Club House", date: "2026-02-01", by: "A-101" }
  ]);

  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [by, setBy] = useState("");

  const add = (e) => {
    e.preventDefault();
    if (!name.trim() || !date.trim() || !by.trim()) return;
    setItems([{ id: Date.now(), name, date, by }, ...items]);
    setName(""); setDate(""); setBy("");
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <h2>Facilities</h2>

        <div className="card">
          <h3>Book Facility</h3>
          <form onSubmit={add} className="grid grid-2">
            <input className="input" placeholder="Facility name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input" placeholder="Date (YYYY-MM-DD)" value={date} onChange={(e) => setDate(e.target.value)} />
            <input className="input" placeholder="Booked by (Flat)" value={by} onChange={(e) => setBy(e.target.value)} />
            <button className="btn">Book</button>
          </form>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h3>Bookings</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Facility</th>
                <th>Date</th>
                <th>Booked By</th>
              </tr>
            </thead>
            <tbody>
              {items.map(f => (
                <tr key={f.id}>
                  <td>{f.name}</td>
                  <td>{f.date}</td>
                  <td>{f.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
