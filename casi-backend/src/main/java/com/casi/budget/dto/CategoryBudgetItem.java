package com.casi.budget.dto;

import java.math.BigDecimal;

// Part 11 GET /api/budgets: byCategory[] item
public record CategoryBudgetItem(
        String category,
        BigDecimal budget,
        BigDecimal spent
) {
}
