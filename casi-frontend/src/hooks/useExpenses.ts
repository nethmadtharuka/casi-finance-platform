import { useQuery } from '@tanstack/react-query'
import { fetchExpenses } from '@/api/expenses'
import { queryKeys } from '@/lib/queryClient'

export function useExpenses(month: string, categoryId?: number) {
  return useQuery({
    queryKey: queryKeys.expenses(month, categoryId),
    queryFn: () => fetchExpenses(month, categoryId),
  })
}
