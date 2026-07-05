package com.casi.budget.dto;

import java.util.List;

// Part 11 GET /api/budgets?month=YYYY-MM full response shape
public record BudgetSummaryResponse(
        OverallBudgetItem overall,
        List<CategoryBudgetItem> byCategory
) {
}
