import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/login";
import Dashboard from "../pages/dashboard/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import ResidentList from "../pages/residents/ResidentList";
import HouseList from "../pages/houses/HousesList";
import HouseHistoryPage from "../pages/houses/HouseHistoryPage";
import PaymentListPage from "../pages/payments/PaymentList";
import ExpenseListPage from "../pages/expenses/ExpensesList";
import MainLayout from "../layouts/MainLayout";
import MonthlyReportPage from "../pages/reports/MonthlyReport";
export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Publik */}
        <Route path="/login" element={<Login />} />

        {/* Route Terproteksi dengan MainLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
       
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
        <Route path="reports" element={<MonthlyReportPage />} />
          <Route path="residents" element={<ResidentList />} />
         
          
          <Route path="houses" element={<HouseList />} />
          <Route path="houses/:id/history" element={<HouseHistoryPage />} />
          <Route path="payments" element={<PaymentListPage />} />
          <Route path="expenses" element={<ExpenseListPage />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}