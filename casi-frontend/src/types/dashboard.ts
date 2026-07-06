import type { OverallBudgetItem } from './budget'
import type { Expense } from './expense'

// Matches DashboardResponse from com.casi.dashboard.dto (Sprint 2)
export interface DashboardResponse {
  overall: OverallBudgetItem
  recentExpenses: Expense[]
}
