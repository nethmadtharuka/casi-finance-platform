import { useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useSetBudget } from '@/hooks/useBudgetSummary'

interface SetBudgetDialogProps {
  month: string // "YYYY-MM"
  currentBudget: number
  onClose: () => void
}

// Part 15's wireframes don't show a dedicated "set budget" screen, and Part 11
// doesn't specify where in the UI this lives — this lightweight dialog, opened
// from the Dashboard's budget bar, is a judgment call to make the budget bar
// meaningfully testable in Sprint 4, not a documented blueprint requirement.
// Worth confirming this is where you actually want budget-setting to live long-term.
export default function SetBudgetDialog({ month, currentBudget, onClose }: SetBudgetDialogProps) {
  const [amount, setAmount] = useState(currentBudget > 0 ? String(currentBudget) : '')
  const setBudget = useSetBudget()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const parsed = Number(amount)
    if (!Number.isFinite(parsed) || parsed <= 0) return

    await setBudget.mutateAsync({
      categoryId: null,
      amount: parsed,
      month: `${month}-01`, // POST expects "YYYY-MM-01" (Sprint 2 quirk)
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-foreground">Set monthly budget</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="budget-amount">Overall budget</Label>
            <Input
              id="budget-amount"
              type="number"
              step="0.01"
              min="0.01"
              autoFocus
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500.00"
            />
          </div>

          <Button type="submit" className="w-full" disabled={setBudget.isPending}>
            {setBudget.isPending ? 'Saving…' : 'Save Budget'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
