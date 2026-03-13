import { useNavigate } from "react-router-dom";
import SecurityNavbar from "../components/SecurityNavbar";

export default function SecurityDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Visitor Management",
      desc: "Verify QR visitors, add manual entries, and manage exit logs.",
      icon: "🛂",
      path: "/security/visitors",
    },
    {
      title: "Gate Entry",
      desc: "Handle entry approval and check active visitor status.",
      icon: "🚪",
      path: "/security/visitors",
    },
    {
      title: "Visitor Logs",
      desc: "Review recent entries, exits, and visitor history.",
      icon: "📋",
      path: "/security/visitors",
    },
    {
      title: "Quick Check",
      desc: "Search visitor details quickly during gate verification.",
      icon: "🔎",
      path: "/security/visitors",
    },
  ];

  return (
    <>
      <SecurityNavbar />

      <div className="container">
        <div className="security-dashboard-header">
          <div>
            <h2>Security Dashboard</h2>
            <p className="subtext">
              Manage gate entry, verify visitors, and maintain security logs.
            </p>
          </div>
        </div>

        <div className="security-dashboard-highlight card">
          <div className="security-dashboard-highlight-icon">🛡️</div>
          <div>
            <h3 style={{ marginBottom: 6 }}>Gate Control Center</h3>
            <p className="subtext" style={{ margin: 0 }}>
              Use this dashboard to verify QR visitors, add manual visitor records,
              and monitor who is currently inside the society.
            </p>
          </div>
        </div>

        <div className="security-dashboard-grid mt-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="security-dashboard-card"
              onClick={() => navigate(card.path)}
            >
              <div className="security-dashboard-icon">{card.icon}</div>

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