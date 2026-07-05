package com.casi.budget.repository;

import com.casi.budget.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BudgetRepository extends JpaRepository<Budget, UUID> {

    // category IS NULL branch — Spring Data derives "Is Null" correctly for the overall budget
    Optional<Budget> findByUserIdAndCategoryIsNullAndMonth(UUID userId, LocalDate month);

    Optional<Budget> findByUserIdAndCategory_IdAndMonth(UUID userId, Integer categoryId, LocalDate month);

    List<Budget> findByUserIdAndMonthAndCategoryIsNotNull(UUID userId, LocalDate month);
}
