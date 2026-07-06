import { useMemo, useState } from 'react'
import { useCategories } from '@/hooks/useCategories'
import { useExpenses } from '@/hooks/useExpenses'
import { getCurrentMonth, formatDayLabel } from '@/lib/date'
import type { Expense } from '@/types/expense'
import MonthSelector from '@/components/MonthSelector'
import CategoryChips from '@/components/CategoryChips'
import ExpenseListItem from '@/components/ExpenseListItem'

// Part 15 Expense History wireframe: month selector, category filter chips,
// list of expense cards grouped by date, tap card → edit/delete.
export default function ExpenseHistoryPage() {
  const [month, setMonth] = useState(getCurrentMonth())
  const [categoryId, setCategoryId] = useState<number | null>(null)

  const categories = useCategories()
  const expenses = useExpenses(month, categoryId ?? undefined)
  const expenseList = expenses.data?.expenses

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, Expense[]>()
    for (const expense of expenseList ?? []) {
      const existing = groups.get(expense.expenseDate) ?? []
      existing.push(expense)
      groups.set(expense.expenseDate, existing)
    }
    // Expenses already arrive sorted desc by date from the backend (Sprint 2's
    // ...OrderByExpenseDateDesc query), so preserving Map insertion order here
    // keeps the same ordering rather than re-sorting client-side.
    return Array.from(groups.entries())
  }, [expenseList])

  return (
    <div className="space-y-6">
      <MonthSelector month={month} onChange={setMonth} />

      <CategoryChips
        categories={categories.data ?? []}
        selectedId={categoryId}
        onSelect={setCategoryId}
        allowAll
        onSelectAll={() => setCategoryId(null)}
      />

      {expenses.isLoading ? (
        <p className="text-sm text-muted-foreground">Loading expenses…</p>
      ) : expenses.isError ? (
        <p className="text-sm text-destructive">Couldn't load expenses. Try again.</p>
      ) : groupedByDate.length === 0 ? (
        <p className="text-sm text-muted-foreground">No expenses for this month yet.</p>
      ) : (
        <div className="space-y-5">
          <p className="figure text-sm text-muted-foreground">
            Total: ${expenses.data?.total.toFixed(2)}
          </p>
          {groupedByDate.map(([date, dayExpenses]) => (
            <div key={date}>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {formatDayLabel(date)}
              </p>
              <div className="space-y-2">
                {dayExpenses.map((expense) => (
                  <ExpenseListItem key={expense.id} expense={expense} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
