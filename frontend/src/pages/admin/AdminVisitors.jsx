import { useEffect, useMemo, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { apiRequest } from "../../api/api";

export default function AdminVisitors() {

  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [flatFilter, setFlatFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const loadVisitors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiRequest("/api/visitors");
      setVisitors(Array.isArray(data) ? data : []);

    } catch (e) {
      setError(e.message || "Failed to load visitors");
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const filteredVisitors = useMemo(() => {
    return visitors.filter((v) => {

      const matchesSearch =
        !search ||
        v.name?.toLowerCase().includes(search.toLowerCase()) ||
        v.purpose?.toLowerCase().includes(search.toLowerCase());

      const matchesFlat =
        !flatFilter ||
        (v.flatNo || v.flat || "").toLowerCase().includes(flatFilter.toLowerCase());

      const matchesDate =
        !dateFilter ||
        new Date(v.entryTime).toISOString().slice(0,10) === dateFilter;

      return matchesSearch && matchesFlat && matchesDate;
    });
  }, [visitors, search, flatFilter, dateFilter]);

  const todayVisitors = visitors.filter(v => {
    if(!v.entryTime) return false;
    const today = new Date().toISOString().slice(0,10);
    const entry = new Date(v.entryTime).toISOString().slice(0,10);
    return today === entry;
  }).length;

  return (
    <>
      <AdminNavbar />

      <div className="container">

        <div className="row" style={{justifyContent:"space-between", marginBottom:14}}>
          <div>
            <h2>Visitor Logs</h2>
            <p className="subtext">Monitor all visitor entries in the society.</p>
          </div>

          <button
            className="btn secondary"
            onClick={loadVisitors}
            style={{width:"auto"}}
          >
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="admin-visitor-stats">

          <div className="admin-visitor-card">
            <span className="stat-label">Total Visitors</span>
            <h3>{visitors.length}</h3>
          </div>

          <div className="admin-visitor-card">
            <span className="stat-label">Today's Visitors</span>
            <h3>{todayVisitors}</h3>
          </div>

        </div>

        {/* Filters */}
        <div className="card mt-4">

          <h3>Search & Filter</h3>

          <div className="grid grid-3">

            <div>
              <label>Search Visitor</label>
              <input
                placeholder="Name or purpose"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
              />
            </div>

            <div>
              <label>Flat Number</label>
              <input
                placeholder="Example A-101"
                value={flatFilter}
                onChange={(e)=>setFlatFilter(e.target.value)}
              />
            </div>

            <div>
              <label>Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e)=>setDateFilter(e.target.value)}
              />
            </div>

          </div>

        </div>

        {/* Visitor Table */}
        <div className="card mt-4">

          <h3>All Visitors</h3>

          {error && <p style={{color:"red"}}>{error}</p>}

          {loading ? (
            <p>Loading visitors...</p>
          ) : filteredVisitors.length === 0 ? (
            <p>No visitors found.</p>
          ) : (

            <div className="table-wrap">

              <table>

                <thead>
                  <tr>
                    <th>Visitor</th>
                    <th>Flat</th>
                    <th>Purpose</th>
                    <th>Entry Time</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredVisitors.map((v) => (

                    <tr key={v._id}>

                      <td>
                        <strong>{v.name}</strong>
                      </td>

                      <td>
                        {v.flatNo || v.flat || "-"}
                      </td>

                      <td>
                        {v.purpose
                          ? <span className="badge">{v.purpose}</span>
                          : "-"
                        }
                      </td>

                      <td>
                        {v.entryTime
                          ? new Date(v.entryTime).toLocaleString()
                          : "-"
                        }
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>
    </>
  );
}