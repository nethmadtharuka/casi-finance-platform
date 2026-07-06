import { Link } from 'react-router-dom'
import type { Expense } from '@/types/expense'

interface ExpenseListItemProps {
  expense: Expense
}

// Part 15: "Recent expenses: last 5, tappable to edit" / History: "Tap card → edit/delete"
export default function ExpenseListItem({ expense }: ExpenseListItemProps) {
  return (
    <Link
      to={`/expenses/${expense.id}/edit`}
      state={{ expense }}
      className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 transition-colors hover:bg-muted"
    >
      <div className="min-w-0">
        <p className="truncate text-sm text-foreground">{expense.note || expense.categoryName}</p>
        <p className="text-xs text-muted-foreground">{expense.categoryName}</p>
      </div>
      <span className="figure ml-3 shrink-0 text-sm text-foreground">
        ${expense.amount.toFixed(2)}
      </span>
    </Link>
  )
}
