import { AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BudgetProgressBarProps {
  spent: number
  budget: number
}

// Part 15: color-coded (green <70%, amber 70-100%, red >100%), but never
// relying on color alone (accessibility) — each state also gets an icon + label.
export default function BudgetProgressBar({ spent, budget }: BudgetProgressBarProps) {
  const percent = budget > 0 ? (spent / budget) * 100 : 0
  const widthPercent = Math.min(percent, 100)

  const state =
    budget === 0
      ? 'none'
      : percent > 100
        ? 'over'
        : percent >= 70
          ? 'close'
          : 'onTrack'

  const barColor = {
    none: 'bg-muted-foreground/30',
    onTrack: 'bg-primary',
    close: 'bg-accent',
    over: 'bg-destructive',
  }[state]

  const label = {
    none: 'No budget set for this month',
    onTrack: 'On track',
    close: 'Getting close to your limit',
    over: 'Over budget',
  }[state]

  const Icon = state === 'over' ? AlertTriangle : state === 'close' ? TrendingUp : CheckCircle2

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="figure text-3xl text-foreground">${spent.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground">
          of {budget > 0 ? `$${budget.toFixed(2)}` : 'no budget set'}
        </span>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn('h-full rounded-full transition-all', barColor)}
          style={{ width: `${widthPercent}%` }}
        />
      </div>

      <div
        className={cn(
          'mt-2 flex items-center gap-1.5 text-xs',
          state === 'over' ? 'text-destructive' : 'text-muted-foreground',
        )}
      >
        <Icon size={14} strokeWidth={2} />
        <span>{label}</span>
      </div>
    </div>
  )
}
