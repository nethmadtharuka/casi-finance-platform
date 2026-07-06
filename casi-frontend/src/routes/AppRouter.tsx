import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from '@/layouts/AuthLayout'
import AppLayout from '@/layouts/AppLayout'
import ProtectedRoute from '@/routes/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import AddExpensePage from '@/pages/AddExpensePage'
import ExpenseHistoryPage from '@/pages/ExpenseHistoryPage'
import ProfilePlaceholder from '@/pages/ProfilePlaceholder'

export default function AppRouter() {
  return (
    <Routes>
      {/* Unauthenticated shell */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated shell — everything under here requires a valid token */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/history" element={<ExpenseHistoryPage />} />
          <Route path="/profile" element={<ProfilePlaceholder />} />
          <Route path="/expenses/new" element={<AddExpensePage />} />
          <Route path="/expenses/:id/edit" element={<AddExpensePage />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}