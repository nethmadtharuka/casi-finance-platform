package com.casi.budget.mapper;

import com.casi.budget.dto.BudgetResponse;
import com.casi.budget.entity.Budget;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BudgetMapper {

    @Mapping(target = "categoryId", expression = "java(budget.getCategory() != null ? budget.getCategory().getId() : null)")
    @Mapping(target = "categoryName", expression = "java(budget.getCategory() != null ? budget.getCategory().getName() : null)")
    BudgetResponse toResponse(Budget budget);
}
