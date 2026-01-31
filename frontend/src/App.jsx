import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import RoleRoute from "./components/RoleRoute";

/* Dashboards */
import AdminDashboard from "./pages/AdminDashboard";
import ResidentDashboard from "./pages/ResidentDashboard";
import SecurityDashboard from "./pages/SecurityDashboard";
import AdminUsers from "./pages/admin/AdminUsers";

/* Admin Pages */
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminBills from "./pages/admin/AdminBills";
import AdminVisitors from "./pages/admin/AdminVisitors";

/* Resident Pages */
import ResidentComplaints from "./pages/resident/ResidentComplaints";
import ResidentBills from "./pages/resident/ResidentBills";
import ResidentFacilities from "./pages/resident/ResidentFacilities";

/* Security Pages */
import SecurityVisitors from "./pages/security/SecurityVisitors";

/* Shared Pages */
import Notices from "./pages/Notices";
import Facilities from "./pages/Facilities";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <RoleRoute allowedRoles={["Admin"]}>
              <AdminComplaints />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/bills"
          element={
            <RoleRoute allowedRoles={["Admin"]}>
              <AdminBills />
            </RoleRoute>
          }
        />
        <Route
  path="/admin/users"
  element={
    <RoleRoute allowedRoles={["Admin"]}>
      <AdminUsers />
    </RoleRoute>
  }
/>

        <Route
          path="/admin/visitors"
          element={
            <RoleRoute allowedRoles={["Admin"]}>
              <AdminVisitors />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/notices"
          element={
            <RoleRoute allowedRoles={["Admin"]}>
              <Notices />
            </RoleRoute>
          }
        />

        <Route
          path="/admin/facilities"
          element={
            <RoleRoute allowedRoles={["Admin"]}>
              <Facilities />
            </RoleRoute>
          }
        />

        {/* ================= RESIDENT ================= */}
        <Route
          path="/resident"
          element={
            <RoleRoute allowedRoles={["Resident"]}>
              <ResidentDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/resident/complaints"
          element={
            <RoleRoute allowedRoles={["Resident"]}>
              <ResidentComplaints />
            </RoleRoute>
          }
        />

        <Route
          path="/resident/bills"
          element={
            <RoleRoute allowedRoles={["Resident"]}>
              <ResidentBills />
            </RoleRoute>
          }
        />

        <Route
          path="/resident/notices"
          element={
            <RoleRoute allowedRoles={["Resident"]}>
              <Notices />
            </RoleRoute>
          }
        />

        <Route
          path="/resident/facilities"
          element={
            <RoleRoute allowedRoles={["Resident"]}>
              <ResidentFacilities />
            </RoleRoute>
          }
        />

        {/* ================= SECURITY ================= */}
        <Route
          path="/security"
          element={
            <RoleRoute allowedRoles={["Security"]}>
              <SecurityDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/security/visitors"
          element={
            <RoleRoute allowedRoles={["Security"]}>
              <SecurityVisitors />
            </RoleRoute>
          }
        />

        <Route
          path="/security/notices"
          element={
            <RoleRoute allowedRoles={["Security"]}>
              <Notices />
            </RoleRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
