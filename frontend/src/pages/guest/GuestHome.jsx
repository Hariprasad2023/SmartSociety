// src/pages/guest/GuestHome.jsx
import GuestNavbar from "../../components/GuestNavbar";

export default function GuestHome() {
  // ✅ Online image URLs (Unsplash)
  const heroImages = [
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
  ];

  const amenityImages = [
    "https://images.unsplash.com/photo-1571902943202-507ec2618db8?auto=format&fit=crop&w=1400&q=80", // gym
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80", // hall/room
    "https://images.unsplash.com/photo-1594125674956-61a9b49c9f19?auto=format&fit=crop&w=1400&q=80", // play/park
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80", // parking/car
  ];

  const securityImages = [
    "https://images.unsplash.com/photo-1581092334470-9c9d63d64b1b?auto=format&fit=crop&w=1400&q=80", // security/camera vibe
    "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1400&q=80", // CCTV
    "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=1400&q=80", // gated community vibe
  ];

  return (
    <>
      <GuestNavbar />

      {/* HERO IMAGE STRIP */}
      <div className="container">
        <h2>Welcome to SmartSociety</h2>

        <div
          className="card"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
            overflow: "hidden",
          }}
        >
          {heroImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Society view ${idx + 1}`}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 10,
              }}
              loading="lazy"
            />
          ))}
        </div>

        <div className="card" style={{ marginTop: 14 }}>
          <h3>About the Society</h3>
          <p>
            SmartSociety Apartments is a secure and well-maintained residential
            community with modern amenities, transparent management, and a
            visitor-friendly process.
          </p>
        </div>

        {/* AMENITIES */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Our Amenities</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 12,
              marginTop: 10,
            }}
          >
            {amenityImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Amenity ${idx + 1}`}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
                loading="lazy"
              />
            ))}
          </div>

          <ul style={{ marginTop: 12 }}>
            <li>Gym</li>
            <li>Community Hall</li>
            <li>Children Play Area</li>
            <li>Parking</li>
          </ul>
        </div>

        {/* SECURITY */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Security & Safety</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              marginTop: 10,
            }}
          >
            {securityImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Security ${idx + 1}`}
                style={{
                  width: "100%",
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
                loading="lazy"
              />
            ))}
          </div>

          <p style={{ marginTop: 12 }}>
            Gate security, CCTV surveillance, and QR-based visitor entry help
            keep residents safe.
          </p>
        </div>

        {/* VISITING INFO */}
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Visiting Information</h3>
          <p>
            <b>Visiting Hours:</b> 9:00 AM – 8:00 PM
          </p>
          <p>
            <b>Visitor Policy:</b> All visitors must register at the gate and
            follow security instructions.
          </p>
        </div>
      </div>
    </>
  );
}
