package com.casi.budget.dto;

import java.math.BigDecimal;

// Part 11 GET /api/budgets: "overall" object
public record OverallBudgetItem(
        BigDecimal budget,
        BigDecimal spent,
        BigDecimal remaining
) {
}
