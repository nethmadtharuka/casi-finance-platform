import { useQuery } from '@tanstack/react-query'
import { fetchDashboard } from '@/api/dashboard'
import { queryKeys } from '@/lib/queryClient'

export function useDashboard(month: string) {
  return useQuery({
    queryKey: queryKeys.dashboard(month),
    queryFn: () => fetchDashboard(month),
  })
}
