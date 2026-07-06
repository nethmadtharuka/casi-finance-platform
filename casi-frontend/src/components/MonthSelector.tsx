import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatMonthLabel, shiftMonth } from '@/lib/date'

interface MonthSelectorProps {
  month: string
  onChange: (month: string) => void
}

export default function MonthSelector({ month, onChange }: MonthSelectorProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, -1))}
        aria-label="Previous month"
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="font-display text-base text-foreground">{formatMonthLabel(month)}</span>
      <button
        type="button"
        onClick={() => onChange(shiftMonth(month, 1))}
        aria-label="Next month"
        className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
