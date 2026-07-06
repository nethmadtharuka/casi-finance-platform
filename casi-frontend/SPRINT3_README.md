# CASI Sprint 3 — Frontend Shell + Auth

Built and verified (via `npm install && npm run build`) against Part 16's Sprint 3 scope:
Vite + React + TS + Tailwind + shadcn/ui setup, router with `AuthLayout`/`AppLayout`,
protected routes, and Login/Register pages wired to your real backend.

## Setup

1. Copy this `casi-frontend/` folder into your `casi-finance-platform/` repo root,
   alongside `casi-backend/` (matching your existing monorepo layout).
2. `cd casi-frontend && npm install`
3. `cp .env.example .env` — defaults to `http://localhost:8080`, adjust if needed
4. Make sure your Sprint 1/2 backend is running (same as your Postman testing)
5. `npm run dev` → opens at `http://localhost:5173` (matches your backend's
   `FRONTEND_ORIGIN` CORS config already, per Sprint 1)

## What's built

- **Login page** (`/login`) and **Register page** (`/register`) — wired to your
  real `POST /api/auth/login` and `POST /api/auth/register` endpoints
- **Zustand auth store** (`src/store/authStore.ts`) — holds `token` and `user` in
  memory only, deliberately not persisted to localStorage (matches your blueprint's
  security stance — a refresh clears the session, which is correct MVP behavior,
  not a bug)
- **Axios client** (`src/lib/axios.ts`) — attaches `Authorization: Bearer <token>`
  to every request automatically; a `401` response triggers auto-logout
- **Protected routing** (`src/routes/ProtectedRoute.tsx`) — `/dashboard` (and future
  `/history`, `/profile`) redirect to `/login` if there's no token
- **AppLayout** — bottom tab nav (Dashboard | History | Profile) per Part 15's
  wireframe, with a floating structure ready for the Add Expense FAB in Sprint 4
- **DashboardPlaceholder** — confirms the auth → protected route flow works
  end-to-end; gets replaced by the real dashboard in Sprint 4

## Design notes

Went with a "ledger" visual direction rather than a generic fintech-blue or
AI-cliché cream/terracotta look, since personal finance tracking is fundamentally
about a clear record — Fraunces (serif) for the wordmark/headings against IBM Plex
Sans for UI text, IBM Plex Mono reserved for numeric figures (the `.figure` class
in `index.css`) so amounts get a distinct, ledger-like treatment once Sprint 4
starts rendering real currency values. Primary accent is a muted ledger-green
rather than bright fintech blue or green. Dark mode variables are already defined
in `index.css` (`.dark` class) — wiring up an actual toggle is Sprint 4/5 scope.

## Exit criteria check (Part 16)

> "can register/login through the actual UI, token persists in memory for the session"

Once your backend is running, this is testable directly:
1. Go to `http://localhost:5173/register`, create an account → should land on
   `/dashboard` showing "You're logged in."
2. Refresh the page → should bounce back to `/login` (token was only in memory —
   this is correct, not a bug)
3. Log back in with the same credentials → back on `/dashboard`
4. Try visiting `http://localhost:5173/dashboard` directly in a new tab with no
   prior login → should redirect to `/login`

## Not built yet (correctly out of Sprint 3 scope per Part 16)

- Dashboard (budget bar, category breakdown, recent expenses) — Sprint 4
- Add Expense page — Sprint 4
- Expense History page — Sprint 4/5
- Profile page, dark mode toggle, password reset — Sprint 5
