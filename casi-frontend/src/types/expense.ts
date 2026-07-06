// Matches ExpenseResponse / ExpenseListResponse from com.casi.expense.dto (Sprint 2)
export interface Expense {
  id: string
  amount: number
  categoryId: number
  categoryName: string
  expenseDate: string // "YYYY-MM-DD"
  note: string | null
}

export interface ExpenseListResponse {
  total: number
  expenses: Expense[]
}

// Matches ExpenseRequest — used for both create and update
export interface ExpensePayload {
  amount: number
  categoryId: number
  expenseDate: string
  note?: string | null
}
