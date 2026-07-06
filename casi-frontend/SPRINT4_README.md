# CASI Sprint 4 — Dashboard, Add Expense, Expense History

Built and verified (`npm install && npm run build && npm run lint`, both clean)
against Part 16's Sprint 4 scope. This replaces the Sprint 3 `DashboardPlaceholder`
with the real pages and wires everything to your Sprint 2 backend via TanStack Query.

## What changed vs. Sprint 3

**New dependencies:** `@tanstack/react-query`, `react-hook-form`, `zod`,
`@hookform/resolvers` — already in `package.json`, just run `npm install`.

**New/changed files** (apply as a diff against your Sprint 3 `casi-frontend/`):
```
src/api/                       ← new: categories.ts, expenses.ts, budgets.ts, dashboard.ts
src/hooks/                     ← new: useCategories, useExpenses, useExpenseMutations,
                                       useBudgetSummary, useDashboard
src/types/                     ← new: category.ts, expense.ts, budget.ts, dashboard.ts
src/schemas/expenseSchema.ts   ← new: Zod validation for the expense form
src/lib/queryClient.ts         ← new: TanStack Query client + query key helpers
src/lib/date.ts                ← new: month/date formatting helpers
src/components/                ← new: BudgetProgressBar, CategoryBreakdown,
                                       ExpenseListItem, CategoryChips, MonthSelector,
                                       SetBudgetDialog
src/pages/DashboardPage.tsx       ← new (replaces DashboardPlaceholder.tsx, now deleted)
src/pages/AddExpensePage.tsx      ← new (handles both create and edit)
src/pages/ExpenseHistoryPage.tsx  ← new
src/pages/ProfilePlaceholder.tsx  ← new (minimal, but logout is real/functional)
src/routes/AppRouter.tsx       ← updated: wires in the pages above
src/layouts/AppLayout.tsx      ← updated: adds the floating "+" Add Expense button
src/App.tsx                    ← updated: wraps the app in QueryClientProvider
```

## Judgment calls worth reviewing

1. **"Set budget" is a dialog opened by tapping the Dashboard's budget bar.**
   Part 15's wireframes don't include a dedicated budget-setting screen, and
   Part 11 doesn't specify where in the UI it lives — but the budget bar needs
   *some* way to get a non-zero number in it to be testable, so I added a
   lightweight modal (`SetBudgetDialog`) as the simplest place for it. Worth
   confirming this is where you actually want it long-term, versus e.g. a
   Profile/Settings screen in Sprint 5.

2. **No GET /api/expenses/{id} endpoint exists**, so editing an expense passes
   the full `Expense` object via React Router's location `state` (set when you
   tap a card in `ExpenseListItem`) rather than fetching it by ID. This works
   for every real user flow (tapping a card from Dashboard or History), but a
   **direct/bookmarked link** to `/expenses/{id}/edit` will show a "couldn't be
   found" message instead of the expense. Flagging as a real gap — worth adding
   the GET-by-id endpoint if deep-linking to a specific expense ever matters.

3. **Category breakdown uses plain divs, not Recharts** — Part 15 explicitly
   says to resist building multiple chart types in MVP and let the budget bar
   be the one real visualization; simple horizontal bars for the category list
   fit that guidance without pulling in a charting library for one component.

4. **Date input is a native `<input type="date">`**, not a custom date-picker
   component/library — kept deliberately simple per the project's own
   "avoid over-engineering" goal. Revisit if the native picker's styling proves
   too inconsistent across browsers/devices in real use.

5. **Dashboard fetches both `/api/dashboard` and `/api/budgets`** (the latter
   just for the `byCategory` breakdown, since `DashboardResponse` doesn't
   include it). This means `overall` data is technically fetched twice on the
   Dashboard page — harmless at this scale, but worth knowing it's there if
   you ever want to trim network calls.

6. **Profile page's logout is real, not a placeholder** — simple enough to wire
   up now, and useful for testing the full loop (register → add expenses →
   logout → log back in → see them again) without waiting for Sprint 5.

## Verification checklist (Part 16 exit criteria: "full add-expense → see-updated-dashboard loop works end-to-end")

1. Log in, land on `/dashboard` — budget bar shows "no budget set"
2. Tap the budget bar → set a budget (e.g. 500) → bar updates immediately
3. Tap the floating **+** button → add an expense (amount, category, date, optional note) → Save
4. Redirected to Dashboard → the new expense appears in "Recent expenses,"
   "spent" total updated, category breakdown shows the category
5. Go to History tab → month selector shows current month, expense appears
   grouped under today's date
6. Filter by the expense's category → it still shows; filter by a different
   category → it disappears
7. Tap the expense (from either Dashboard or History) → edit form pre-fills
   correctly → change the amount → Save → updated everywhere
8. Tap the expense again → **Delete Expense** → confirm → gone from both
   History and Dashboard
9. Try visiting an edit URL directly (e.g. copy the URL bar) without tapping
   through → confirm you see the "couldn't be found" message (expected, see
   judgment call #2 above)

## Not built yet (correctly out of Sprint 4 scope per Part 16)

- Empty/loading/error state polish across all pages — Sprint 5
- Mobile responsiveness pass — Sprint 5 (built mobile-first already, but no
  dedicated pass yet)
- Password reset — Sprint 5
- Dark mode toggle (CSS variables exist since Sprint 3, just not wired to a switch)
