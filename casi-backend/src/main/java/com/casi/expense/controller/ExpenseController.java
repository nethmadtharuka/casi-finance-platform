package com.casi.expense.controller;

import com.casi.expense.dto.ExpenseListResponse;
import com.casi.expense.dto.ExpenseRequest;
import com.casi.expense.dto.ExpenseResponse;
import com.casi.expense.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    // POST /api/expenses — Part 11
    @PostMapping
    public ResponseEntity<ExpenseResponse> addExpense(@Valid @RequestBody ExpenseRequest request) {
        ExpenseResponse response = expenseService.addExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/expenses?month=YYYY-MM&categoryId= — Part 11
    @GetMapping
    public ResponseEntity<ExpenseListResponse> getExpenses(
            @RequestParam(required = false) String month,
            @RequestParam(required = false) Integer categoryId) {
        return ResponseEntity.ok(expenseService.getExpenses(month, categoryId));
    }

    // PUT /api/expenses/{id} — Part 11
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable UUID id,
            @Valid @RequestBody ExpenseRequest request) {
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    // DELETE /api/expenses/{id} — Part 11
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable UUID id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
