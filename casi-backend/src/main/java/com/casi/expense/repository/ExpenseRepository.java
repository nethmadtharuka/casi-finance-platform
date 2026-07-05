package com.casi.expense.repository;

import com.casi.expense.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    // Ownership-scoped lookup for update/delete (Part 12: query-level scoping + service-level re-check)
    Optional<Expense> findByIdAndUserId(UUID id, UUID userId);

    List<Expense> findByUserIdAndExpenseDateBetweenOrderByExpenseDateDesc(
            UUID userId, LocalDate start, LocalDate end);

    List<Expense> findByUserIdAndExpenseDateBetweenAndCategory_IdOrderByExpenseDateDesc(
            UUID userId, LocalDate start, LocalDate end, Integer categoryId);

    List<Expense> findTop5ByUserIdOrderByExpenseDateDescCreatedAtDesc(UUID userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.userId = :userId AND e.expenseDate BETWEEN :start AND :end")
    BigDecimal sumByUserAndDateRange(@Param("userId") UUID userId,
                                      @Param("start") LocalDate start,
                                      @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.userId = :userId AND e.category.id = :categoryId " +
           "AND e.expenseDate BETWEEN :start AND :end")
    BigDecimal sumByUserAndCategoryAndDateRange(@Param("userId") UUID userId,
                                                 @Param("categoryId") Integer categoryId,
                                                 @Param("start") LocalDate start,
                                                 @Param("end") LocalDate end);

    @Query("SELECT DISTINCT e.category.id FROM Expense e " +
           "WHERE e.userId = :userId AND e.expenseDate BETWEEN :start AND :end")
    List<Integer> findDistinctCategoryIdsByUserAndDateRange(@Param("userId") UUID userId,
                                                             @Param("start") LocalDate start,
                                                             @Param("end") LocalDate end);
}
