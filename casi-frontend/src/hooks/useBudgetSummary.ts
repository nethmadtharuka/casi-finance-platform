import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBudgetSummary, setBudget } from '@/api/budgets'
import { queryKeys } from '@/lib/queryClient'
import type { BudgetPayload } from '@/types/budget'

export function useBudgetSummary(month: string) {
  return useQuery({
    queryKey: queryKeys.budgetSummary(month),
    queryFn: () => fetchBudgetSummary(month),
  })
}

export function useSetBudget() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BudgetPayload) => setBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgetSummary'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}
