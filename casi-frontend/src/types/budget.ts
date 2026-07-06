// Matches Budget DTOs from com.casi.budget.dto (Sprint 2)
export interface OverallBudgetItem {
  budget: number
  spent: number
  remaining: number
}

export interface CategoryBudgetItem {
  category: string
  budget: number
  spent: number
}

export interface BudgetSummaryResponse {
  overall: OverallBudgetItem
  byCategory: CategoryBudgetItem[]
}

// Matches BudgetRequest — note the month format is "YYYY-MM-01" here,
// while GET /api/budgets and /api/dashboard use plain "YYYY-MM" (Sprint 2 quirk).
export interface BudgetPayload {
  categoryId: number | null
  amount: number
  month: string
}
