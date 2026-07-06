import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

// Sprint 3 exit criteria: unauthenticated users can't reach app routes.
// Token lives only in memory (Zustand, no persistence), so a hard refresh
// on a protected route correctly bounces back to /login — that's intentional.
export default function ProtectedRoute() {
  const token = useAuthStore((s) => s.token)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
