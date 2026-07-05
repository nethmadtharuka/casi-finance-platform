package com.casi.dashboard.service;

import com.casi.budget.dto.BudgetSummaryResponse;
import com.casi.budget.service.BudgetService;
import com.casi.common.security.CurrentUserProvider;
import com.casi.dashboard.dto.DashboardResponse;
import com.casi.expense.dto.ExpenseResponse;
import com.casi.expense.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

/**
 * Part 11: "a deliberate exception to strict module boundaries — it's a read-only
 * aggregation, implemented as a thin composition ... that calls ExpenseService and
 * BudgetService, not a shortcut that reaches into their repositories directly."
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private static final int RECENT_EXPENSES_LIMIT = 5;

    private final ExpenseService expenseService;
    private final BudgetService budgetService;
    private final CurrentUserProvider currentUserProvider;

    public DashboardResponse getDashboard(String monthParam) {
        UUID userId = currentUserProvider.getCurrentUserId();

        BudgetSummaryResponse budgetSummary = budgetService.getBudgetSummary(monthParam);
        List<ExpenseResponse> recentExpenses = expenseService.getRecentExpenses(userId, RECENT_EXPENSES_LIMIT);

        return new DashboardResponse(budgetSummary.overall(), recentExpenses);
    }
}
