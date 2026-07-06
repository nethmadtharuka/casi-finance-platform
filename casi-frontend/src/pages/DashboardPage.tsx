import { useState } from 'react'
import { useDashboard } from '@/hooks/useDashboard'
import { useBudgetSummary } from '@/hooks/useBudgetSummary'
import { getCurrentMonth } from '@/lib/date'
import BudgetProgressBar from '@/components/BudgetProgressBar'
import CategoryBreakdown from '@/components/CategoryBreakdown'
import ExpenseListItem from '@/components/ExpenseListItem'
import MonthSelector from '@/components/MonthSelector'
import SetBudgetDialog from '@/components/SetBudgetDialog'

// Part 15 Dashboard wireframe: header, budget bar, this-month total,
// top-5 category breakdown, last-5 recent expenses (tappable to edit).
export default function DashboardPage() {
  const [month, setMonth] = useState(getCurrentMonth())
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false)

  const dashboard = useDashboard(month)
  const budgetSummary = useBudgetSummary(month)

  if (dashboard.isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <p className="text-sm text-destructive">
        Couldn't load your dashboard. Check your connection and try again.
      </p>
    )
  }

  const { overall, recentExpenses } = dashboard.data

  return (
    <div className="space-y-8">
      <MonthSelector month={month} onChange={setMonth} />

      <section>
        <button
          type="button"
          onClick={() => setBudgetDialogOpen(true)}
          className="w-full text-left"
          aria-label="Edit monthly budget"
        >
          <BudgetProgressBar spent={overall.spent} budget={overall.budget} />
        </button>
      </section>

      <section>
        <h2 className="mb-3 font-display text-base text-foreground">Category breakdown</h2>
        {budgetSummary.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <CategoryBreakdown items={budgetSummary.data?.byCategory ?? []} />
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-base text-foreground">Recent expenses</h2>
        {recentExpenses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No expenses yet — tap the + button to add your first one.
          </p>
        ) : (
          <div className="space-y-2">
            {recentExpenses.map((expense) => (
              <ExpenseListItem key={expense.id} expense={expense} />
            ))}
          </div>
        )}
      </section>

      {budgetDialogOpen && (
        <SetBudgetDialog
          month={month}
          currentBudget={overall.budget}
          onClose={() => setBudgetDialogOpen(false)}
        />
      )}
    </div>
  )
}
