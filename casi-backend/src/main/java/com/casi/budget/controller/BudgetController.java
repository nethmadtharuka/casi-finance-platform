package com.casi.budget.controller;

import com.casi.budget.dto.BudgetRequest;
import com.casi.budget.dto.BudgetResponse;
import com.casi.budget.dto.BudgetSummaryResponse;
import com.casi.budget.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    // POST /api/budgets — Part 11, upsert semantics
    @PostMapping
    public ResponseEntity<BudgetResponse> setBudget(@Valid @RequestBody BudgetRequest request) {
        BudgetResponse response = budgetService.setBudget(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/budgets?month=YYYY-MM — Part 11
    @GetMapping
    public ResponseEntity<BudgetSummaryResponse> getBudgetSummary(
            @RequestParam(required = false) String month) {
        return ResponseEntity.ok(budgetService.getBudgetSummary(month));
    }
}
