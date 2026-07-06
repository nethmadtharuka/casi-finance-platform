import type { CategoryBudgetItem } from '@/types/budget'

interface CategoryBreakdownProps {
  items: CategoryBudgetItem[]
}

// Part 15: "simple horizontal bars or small list, top 5 categories" — deliberately
// plain divs rather than pulling in Recharts, per Part 15's own guidance to keep
// MVP visualization to one real chart (the budget bar above), not several.
export default function CategoryBreakdown({ items }: CategoryBreakdownProps) {
  const top5 = [...items].sort((a, b) => b.spent - a.spent).slice(0, 5)

  if (top5.length === 0) {
    return <p className="text-sm text-muted-foreground">No spending yet this month.</p>
  }

  const maxSpent = Math.max(...top5.map((i) => i.spent), 1)

  return (
    <div className="space-y-3">
      {top5.map((item) => (
        <div key={item.category}>
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-foreground">{item.category}</span>
            <span className="figure text-muted-foreground">${item.spent.toFixed(2)}</span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary/70"
              style={{ width: `${(item.spent / maxSpent) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
