import GuestNavbar from "../../components/GuestNavbar";

export default function GuestAmenities() {
  const amenities = [
    { name: "Gym", details: "Open 6:00 AM – 9:00 PM" },
    { name: "Community Hall", details: "Available for events & functions" },
    { name: "Children Play Area", details: "Safe play zone for kids" },
    { name: "Parking", details: "2-wheeler & 4-wheeler parking" },
    { name: "CCTV Surveillance", details: "Common areas monitored" },
    { name: "Power Backup", details: "Backup for common areas" },
  ];

  return (
    <>
      <GuestNavbar />

      <div className="container">
        <h2>Amenities</h2>

        <div className="card">
          <p style={{ margin: 0 }}>
            Explore the facilities available in SmartSociety.
          </p>
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Amenity</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {amenities.map((a, idx) => (
                <tr key={idx}>
                  <td>{a.name}</td>
                  <td>{a.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
