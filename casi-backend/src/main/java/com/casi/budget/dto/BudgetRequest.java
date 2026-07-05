package com.casi.budget.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;

// Part 11: { categoryId: int | null, amount, month: "YYYY-MM-01" }
public record BudgetRequest(

        Integer categoryId, // null = overall budget

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        BigDecimal amount,

        @NotNull(message = "Month is required")
        @Pattern(regexp = "\\d{4}-\\d{2}-01", message = "Month must be in YYYY-MM-01 format")
        String month
) {
}
