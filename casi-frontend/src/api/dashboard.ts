import { api } from '@/lib/axios'
import type { DashboardResponse } from '@/types/dashboard'

export async function fetchDashboard(month: string): Promise<DashboardResponse> {
  const { data } = await api.get<DashboardResponse>('/api/dashboard', { params: { month } })
  return data
}
