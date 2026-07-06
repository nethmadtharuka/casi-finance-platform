import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addExpense, updateExpense, deleteExpense } from '@/api/expenses'
import type { ExpensePayload } from '@/types/expense'

// All three mutations invalidate expenses/budget/dashboard queries broadly
// (rather than surgically patching cached data) — simplest correct approach
// at this scale; revisit only if invalidation churn becomes a real perf issue.
function useInvalidateFinanceQueries() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: ['expenses'] })
    queryClient.invalidateQueries({ queryKey: ['budgetSummary'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }
}

export function useAddExpense() {
  const invalidate = useInvalidateFinanceQueries()
  return useMutation({
    mutationFn: (payload: ExpensePayload) => addExpense(payload),
    onSuccess: invalidate,
  })
}

export function useUpdateExpense() {
  const invalidate = useInvalidateFinanceQueries()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ExpensePayload }) =>
      updateExpense(id, payload),
    onSuccess: invalidate,
  })
}

export function useDeleteExpense() {
  const invalidate = useInvalidateFinanceQueries()
  return useMutation({
    mutationFn: (id: string) => deleteExpense(id),
    onSuccess: invalidate,
  })
}
