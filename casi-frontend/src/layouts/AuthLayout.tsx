import { Outlet } from 'react-router-dom'

// Part 15 wireframes: Login/Register are centered, minimal, logo-first screens —
// no nav chrome, since an unauthenticated user has nowhere else to go yet.
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-display text-3xl tracking-tight text-foreground">
            CASI
          </span>
          <div className="mx-auto mt-3 h-px w-10 bg-primary" />
          <p className="mt-3 text-sm text-muted-foreground">
            A clear ledger for where your money goes.
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
