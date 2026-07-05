package com.casi.budget.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

// Part 11 POST /api/budgets response: created/updated budget (upsert semantics)
public record BudgetResponse(
        UUID id,
        Integer categoryId,
        String categoryName, // null when this is the overall budget
        BigDecimal amount,
        LocalDate month
) {
}
