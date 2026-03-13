import { useNavigate } from "react-router-dom";
import ResidentNavbar from "../components/ResidentNavbar";

export default function ResidentDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "My Complaints",
      desc: "Raise and track complaints in your society.",
      path: "/resident/complaints",
      icon: "🛠️",
    },
    {
      title: "My Bills",
      desc: "Check maintenance bills and payment status.",
      path: "/resident/bills",
      icon: "💳",
    },
    {
      title: "Facilities",
      desc: "Book society facilities like hall or gym.",
      path: "/resident/facilities",
      icon: "🏢",
    },
    {
      title: "Notices",
      desc: "Stay updated with society announcements.",
      path: "/resident/notices",
      icon: "📢",
    },
  ];

  return (
    <>
      <ResidentNavbar />

      <div className="container">

        <div className="resident-dashboard-header">
          <div>
            <h2>Resident Dashboard</h2>
            <p className="subtext">
              Manage complaints, bills, facility bookings and stay updated with society notices.
            </p>
          </div>
        </div>

        <div className="resident-dashboard-grid">

          {cards.map((card) => (
            <div
              key={card.title}
              className="resident-dashboard-card"
              onClick={() => navigate(card.path)}
            >
              <div className="resident-dashboard-icon">
                {card.icon}
              </div>

              <h3>{card.title}</h3>

              <p>{card.desc}</p>

              <button
                className="btn primary"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(card.path);
                }}
              >
                Open
              </button>
            </div>
          ))}

        </div>

      </div>
    </>
  );
}