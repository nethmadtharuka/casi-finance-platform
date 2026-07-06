// Sprint 3 only builds the shell + auth. The real Dashboard (budget bar,
// category breakdown, recent expenses per Part 15) is Sprint 4 scope.
// This placeholder exists purely so /dashboard has somewhere to land after login.
export default function DashboardPlaceholder() {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      <p className="font-display text-xl text-foreground">You're logged in.</p>
      <p className="mt-2 text-sm text-muted-foreground">
        The real dashboard — budget bar, category breakdown, recent expenses —
        is built in Sprint 4. This confirms the auth flow and protected routing work.
      </p>
    </div>
  )
}
