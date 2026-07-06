import { cn } from '@/lib/utils'
import type { Category } from '@/types/category'

interface CategoryChipsProps {
  categories: Category[]
  selectedId: number | null
  onSelect: (id: number) => void
  /** When true, includes an "All" chip that selects null (used in History filters) */
  allowAll?: boolean
  onSelectAll?: () => void
}

// Part 15 Add Expense wireframe: "Category chips, horizontally scrollable, single-select"
export default function CategoryChips({
  categories,
  selectedId,
  onSelect,
  allowAll,
  onSelectAll,
}: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {allowAll && (
        <button
          type="button"
          onClick={onSelectAll}
          className={cn(
            'shrink-0 rounded-full border px-4 py-2 text-sm transition-colors',
            selectedId === null
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-foreground hover:bg-muted',
          )}
        >
          All
        </button>
      )}
      {categories.map((category) => (
        <button
          key={category.id}
          type="button"
          onClick={() => onSelect(category.id)}
          className={cn(
            'shrink-0 rounded-full border px-4 py-2 text-sm transition-colors',
            selectedId === category.id
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-card text-foreground hover:bg-muted',
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
