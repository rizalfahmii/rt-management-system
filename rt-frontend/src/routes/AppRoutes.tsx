import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/login";
import Dashboard from "../pages/dashboard/Dashboard";
import AdminLayout from "../layouts/AdminLayouts";
import ProtectedRoute from "../components/ProtectedRoute";
import ResidentList from "../pages/residents/ResidentList";
import ResidentFormPage from "../pages/residents/ResidentFormPage";
import HouseList from "../pages/houses/HousesList";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="residents" element={<ResidentList />} />
          <Route path="residents/create" element={<ResidentFormPage />} />
          <Route path="houses" element={<HouseList />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}