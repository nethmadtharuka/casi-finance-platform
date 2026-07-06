import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '@/api/categories'
import { queryKeys } from '@/lib/queryClient'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: fetchCategories,
    staleTime: 5 * 60_000, // categories rarely change within a session
  })
}
