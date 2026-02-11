import GuestNavbar from "../../components/GuestNavbar";

export default function GuestContact() {
  return (
    <>
      <GuestNavbar />

      <div className="container">
        <h2>Contact & Information</h2>

        {/* Contact Details */}
        <div className="card">
          <h3>Society Contact</h3>
          <p><b>Society Name:</b> SmartSociety Apartments</p>
          <p><b>Phone:</b> +91 9XXXXXXXXX</p>
          <p><b>Email:</b> society@email.com</p>
          <p><b>Office Hours:</b> 10:00 AM – 6:00 PM</p>
        </div>

        {/* Address */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Address</h3>
          <p>
            SmartSociety Apartments<br />
            Near Main Road,<br />
            Area / Locality Name,<br />
            City – PIN Code,<br />
            State, India
          </p>
        </div>

        {/* General Info */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>General Information</h3>
          <ul style={{ marginTop: 8 }}>
            <li>Visiting hours: 9:00 AM – 8:00 PM</li>
            <li>All visitors must register at the security gate</li>
            <li>QR-based visitor entry is followed</li>
            <li>Noise restrictions after 10:00 PM</li>
            <li>Parking is allowed only in designated areas</li>
          </ul>
        </div>

        {/* FAQ */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Frequently Asked Questions (FAQ)</h3>

          <p><b>Q. Can guests visit without permission?</b></p>
          <p>A. No. All guests must be approved by the resident.</p>

          <p><b>Q. Is visitor parking available?</b></p>
          <p>A. Limited visitor parking is available near the gate.</p>

          <p><b>Q. Are pets allowed?</b></p>
          <p>A. Pets are allowed but must follow society guidelines.</p>

          <p><b>Q. How is security managed?</b></p>
          <p>A. Security staff monitor entries using visitor logs and QR verification.</p>
        </div>
      </div>
    </>
  );
}
