import { useNavigate } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Complaints",
      desc: "View and resolve resident complaints.",
      icon: "🛠️",
      path: "/admin/complaints",
    },
    {
      title: "Bills",
      desc: "Generate and manage maintenance bills.",
      icon: "💳",
      path: "/admin/bills",
    },
    {
      title: "Facilities",
      desc: "Manage facility bookings and schedules.",
      icon: "🏢",
      path: "/admin/facilities",
    },
    {
      title: "Visitor Logs",
      desc: "Track visitors entering the society.",
      icon: "🚶",
      path: "/admin/visitors",
    },
    {
      title: "Users",
      desc: "Create residents and security accounts.",
      icon: "👥",
      path: "/admin/users",
    },
    {
      title: "Notices",
      desc: "Post announcements for residents.",
      icon: "📢",
      path: "/admin/notices",
    },
  ];

  return (
    <>
      <AdminNavbar />

      <div className="container">

        <div className="admin-dashboard-header">
          <div>
            <h2>Admin Dashboard</h2>
            <p className="subtext">
              Manage society operations, residents, visitors and facilities.
            </p>
          </div>
        </div>

        <div className="admin-dashboard-grid">

          {cards.map((card) => (
            <div
              key={card.title}
              className="admin-dashboard-card"
              onClick={() => navigate(card.path)}
            >

              <div className="admin-dashboard-icon">
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