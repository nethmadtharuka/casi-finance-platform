import { api } from '@/lib/axios'
import type { BudgetSummaryResponse, BudgetPayload } from '@/types/budget'

// Note: GET here takes "YYYY-MM" (query param), unlike POST's "YYYY-MM-01" body field —
// a real Sprint 2 API inconsistency, not a typo. See Sprint 2 README for the flag.
export async function fetchBudgetSummary(month: string): Promise<BudgetSummaryResponse> {
  const { data } = await api.get<BudgetSummaryResponse>('/api/budgets', { params: { month } })
  return data
}

export async function setBudget(payload: BudgetPayload) {
  const { data } = await api.post('/api/budgets', payload)
  return data
}
