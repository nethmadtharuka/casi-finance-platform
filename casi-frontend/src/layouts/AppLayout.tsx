import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Plus, Receipt, User } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

// Part 15: bottom tab nav (Dashboard | History | Profile), mobile-first.
// "Add Expense isn't a tab — it's a floating action button reachable from any
// screen, reinforcing that adding an expense is the primary action."
export default function AppLayout() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border px-5 py-4">
        <p className="font-display text-lg text-foreground">
          Hi, {user?.name ?? 'there'}
        </p>
      </header>

      <main className="flex-1 px-5 py-6 pb-24">
        <Outlet />
      </main>

      <NavLink
        to="/expenses/new"
        aria-label="Add expense"
        className="fixed bottom-20 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Plus size={26} strokeWidth={2.25} />
      </NavLink>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card">
        <div className="mx-auto flex max-w-md justify-around">
          <TabLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <TabLink to="/history" icon={Receipt} label="History" />
          <TabLink to="/profile" icon={User} label="Profile" />
        </div>
      </nav>
    </div>
  )
}

function TabLink({
  to,
  icon: Icon,
  label,
}: {
  to: string
  icon: typeof LayoutDashboard
  label: string
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors',
          isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
        )
      }
    >
      <Icon size={20} strokeWidth={1.75} />
      {label}
    </NavLink>
  )
}