package com.casi.budget.service;

import com.casi.budget.dto.*;
import com.casi.budget.entity.Budget;
import com.casi.budget.mapper.BudgetMapper;
import com.casi.budget.repository.BudgetRepository;
import com.casi.category.entity.Category;
import com.casi.category.repository.CategoryRepository;
import com.casi.category.service.CategoryService;
import com.casi.common.security.CurrentUserProvider;
import com.casi.common.util.DateUtils;
import com.casi.expense.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final BudgetMapper budgetMapper;
    private final CategoryService categoryService;
    private final CategoryRepository categoryRepository;
    private final ExpenseService expenseService; // Budget depends on Expense, never the reverse (Part 7)
    private final CurrentUserProvider currentUserProvider;

    /**
     * Upsert semantics per Part 11: setting a budget for a month/category that already
     * exists updates it, rather than throwing a duplicate-key error. The unique constraint
     * on (user_id, category_id, month) is the DB-level backstop (Part 10); this lookup is
     * the app-level equivalent so we get a clean update instead of a constraint violation.
     */
    public BudgetResponse setBudget(BudgetRequest request) {
        UUID userId = currentUserProvider.getCurrentUserId();
        LocalDate month = LocalDate.parse(request.month());

        Category category = null;
        if (request.categoryId() != null) {
            category = categoryService.getCategoryOrThrow(request.categoryId());
        }

        Budget budget = (request.categoryId() == null)
                ? budgetRepository.findByUserIdAndCategoryIsNullAndMonth(userId, month).orElse(null)
                : budgetRepository.findByUserIdAndCategory_IdAndMonth(userId, request.categoryId(), month).orElse(null);

        if (budget == null) {
            budget = Budget.builder()
                    .userId(userId)
                    .category(category)
                    .amount(request.amount())
                    .month(month)
                    .build();
        } else {
            budget.setAmount(request.amount());
        }

        Budget saved = budgetRepository.save(budget);
        return budgetMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public BudgetSummaryResponse getBudgetSummary(String monthParam) {
        UUID userId = currentUserProvider.getCurrentUserId();
        YearMonth yearMonth = DateUtils.parseMonthOrCurrent(monthParam);
        LocalDate month = DateUtils.firstOfMonth(yearMonth);

        // Overall
        BigDecimal overallBudget = budgetRepository.findByUserIdAndCategoryIsNullAndMonth(userId, month)
                .map(Budget::getAmount)
                .orElse(BigDecimal.ZERO);
        BigDecimal overallSpent = expenseService.getTotalSpent(userId, yearMonth);
        OverallBudgetItem overall = new OverallBudgetItem(
                overallBudget, overallSpent, overallBudget.subtract(overallSpent));

        // Per-category — union of categories with an explicit budget set this month
        // and categories with any spending this month, so both show up in the breakdown.
        List<Budget> categoryBudgets = budgetRepository.findByUserIdAndMonthAndCategoryIsNotNull(userId, month);
        Set<Integer> categoryIds = new LinkedHashSet<>();
        categoryBudgets.forEach(b -> categoryIds.add(b.getCategory().getId()));
        categoryIds.addAll(expenseService.getCategoryIdsWithActivity(userId, yearMonth));

        List<CategoryBudgetItem> byCategory = categoryIds.stream()
                .map(categoryId -> {
                    Category category = categoryRepository.findById(categoryId).orElseThrow();
                    BigDecimal budgetAmount = categoryBudgets.stream()
                            .filter(b -> b.getCategory().getId().equals(categoryId))
                            .map(Budget::getAmount)
                            .findFirst()
                            .orElse(BigDecimal.ZERO);
                    BigDecimal spent = expenseService.getTotalSpentForCategory(userId, categoryId, yearMonth);
                    return new CategoryBudgetItem(category.getName(), budgetAmount, spent);
                })
                .toList();

        return new BudgetSummaryResponse(overall, byCategory);
    }
}
