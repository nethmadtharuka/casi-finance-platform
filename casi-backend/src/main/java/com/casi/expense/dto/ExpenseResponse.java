package com.casi.expense.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

// Part 11: "full expense object with category name resolved"
public record ExpenseResponse(
        UUID id,
        BigDecimal amount,
        Integer categoryId,
        String categoryName,
        LocalDate expenseDate,
        String note
) {
}
