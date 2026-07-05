package com.casi.dashboard.dto;

import com.casi.budget.dto.OverallBudgetItem;
import com.casi.expense.dto.ExpenseResponse;

import java.util.List;

// Part 11 GET /api/dashboard: overall budget summary + recent expenses + total spent
public record DashboardResponse(
        OverallBudgetItem overall,
        List<ExpenseResponse> recentExpenses
) {
}
