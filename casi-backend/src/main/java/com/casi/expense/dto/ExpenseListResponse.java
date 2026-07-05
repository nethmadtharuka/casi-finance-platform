package com.casi.expense.dto;

import java.math.BigDecimal;
import java.util.List;

// Part 11 GET /api/expenses: { "total": number, "expenses": [...] }
public record ExpenseListResponse(
        BigDecimal total,
        List<ExpenseResponse> expenses
) {
}
