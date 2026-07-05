package com.casi.expense.service;

import com.casi.category.entity.Category;
import com.casi.category.service.CategoryService;
import com.casi.common.exception.ResourceNotFoundException;
import com.casi.common.exception.UnauthorizedAccessException;
import com.casi.common.security.CurrentUserProvider;
import com.casi.common.util.DateUtils;
import com.casi.expense.dto.ExpenseListResponse;
import com.casi.expense.dto.ExpenseRequest;
import com.casi.expense.dto.ExpenseResponse;
import com.casi.expense.entity.Expense;
import com.casi.expense.mapper.ExpenseMapper;
import com.casi.expense.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseService {

    // Reasonable guard per FR-3: don't let the date wander too far into the future.
    private static final int MAX_FUTURE_DAYS = 1;

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;
    private final CategoryService categoryService;
    private final CurrentUserProvider currentUserProvider;

    public ExpenseResponse addExpense(ExpenseRequest request) {
        UUID userId = currentUserProvider.getCurrentUserId();
        Category category = categoryService.getCategoryOrThrow(request.categoryId());
        validateExpenseDate(request.expenseDate());

        Expense expense = Expense.builder()
                .userId(userId)
                .category(category)
                .amount(request.amount())
                .note(request.note())
                .expenseDate(request.expenseDate())
                .build();

        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ExpenseListResponse getExpenses(String monthParam, Integer categoryId) {
        UUID userId = currentUserProvider.getCurrentUserId();
        YearMonth month = DateUtils.parseMonthOrCurrent(monthParam);
        LocalDate start = DateUtils.startOfMonth(month);
        LocalDate end = DateUtils.endOfMonth(month);

        List<Expense> expenses = (categoryId != null)
                ? expenseRepository.findByUserIdAndExpenseDateBetweenAndCategory_IdOrderByExpenseDateDesc(
                        userId, start, end, categoryId)
                : expenseRepository.findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(userId, start, end);

        BigDecimal total = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<ExpenseResponse> responses = expenses.stream().map(expenseMapper::toResponse).toList();
        return new ExpenseListResponse(total, responses);
    }

    public ExpenseResponse updateExpense(UUID expenseId, ExpenseRequest request) {
        UUID userId = currentUserProvider.getCurrentUserId();
        Expense expense = getOwnedExpenseOrThrow(expenseId, userId);

        Category category = categoryService.getCategoryOrThrow(request.categoryId());
        validateExpenseDate(request.expenseDate());

        expense.setCategory(category);
        expense.setAmount(request.amount());
        expense.setNote(request.note());
        expense.setExpenseDate(request.expenseDate());

        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toResponse(saved);
    }

    public void deleteExpense(UUID expenseId) {
        UUID userId = currentUserProvider.getCurrentUserId();
        Expense expense = getOwnedExpenseOrThrow(expenseId, userId);
        expenseRepository.delete(expense);
    }

    /**
     * Part 12: query-level scoping (findByIdAndUserId) is enough for reads, but mutations
     * get an explicit ownership check that throws a clear, testable exception instead of
     * silently affecting zero rows.
     */
    private Expense getOwnedExpenseOrThrow(UUID expenseId, UUID userId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found: " + expenseId));

        if (!expense.getUserId().equals(userId)) {
            throw new UnauthorizedAccessException("You do not have access to this expense");
        }
        return expense;
    }

    private void validateExpenseDate(LocalDate date) {
        if (date.isAfter(LocalDate.now().plusDays(MAX_FUTURE_DAYS))) {
            throw new IllegalArgumentException("Expense date cannot be in the future");
        }
    }

    // ---- Internal helpers consumed by BudgetService / DashboardService (Part 7 dependency direction) ----

    @Transactional(readOnly = true)
    public BigDecimal getTotalSpent(UUID userId, YearMonth month) {
        return expenseRepository.sumByUserAndDateRange(
                userId, DateUtils.startOfMonth(month), DateUtils.endOfMonth(month));
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalSpentForCategory(UUID userId, Integer categoryId, YearMonth month) {
        return expenseRepository.sumByUserAndCategoryAndDateRange(
                userId, categoryId, DateUtils.startOfMonth(month), DateUtils.endOfMonth(month));
    }

    @Transactional(readOnly = true)
    public List<Integer> getCategoryIdsWithActivity(UUID userId, YearMonth month) {
        return expenseRepository.findDistinctCategoryIdsByUserAndDateRange(
                userId, DateUtils.startOfMonth(month), DateUtils.endOfMonth(month));
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getRecentExpenses(UUID userId, int limit) {
        return expenseRepository.findTop5ByUserIdOrderByExpenseDateDescCreatedAtDesc(userId).stream()
                .limit(limit)
                .map(expenseMapper::toResponse)
                .toList();
    }
}
