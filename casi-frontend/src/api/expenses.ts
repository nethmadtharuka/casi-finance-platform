import { api } from '@/lib/axios'
import type { Expense, ExpenseListResponse, ExpensePayload } from '@/types/expense'

export async function fetchExpenses(month: string, categoryId?: number): Promise<ExpenseListResponse> {
  const { data } = await api.get<ExpenseListResponse>('/api/expenses', {
    params: { month, categoryId },
  })
  return data
}

export async function addExpense(payload: ExpensePayload): Promise<Expense> {
  const { data } = await api.post<Expense>('/api/expenses', payload)
  return data
}

export async function updateExpense(id: string, payload: ExpensePayload): Promise<Expense> {
  const { data } = await api.put<Expense>(`/api/expenses/${id}`, payload)
  return data
}

export async function deleteExpense(id: string): Promise<void> {
  await api.delete(`/api/expenses/${id}`)
}
