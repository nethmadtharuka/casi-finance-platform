package com.casi.expense.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

// Part 11: { amount, categoryId, expenseDate, note? }
public record ExpenseRequest(

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
        BigDecimal amount,

        @NotNull(message = "Category is required")
        Integer categoryId,

        @NotNull(message = "Expense date is required")
        LocalDate expenseDate,

        @Size(max = 255, message = "Note must be 255 characters or fewer")
        String note
) {
}
