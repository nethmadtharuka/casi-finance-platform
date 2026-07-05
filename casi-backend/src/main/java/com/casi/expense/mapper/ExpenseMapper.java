package com.casi.expense.mapper;

import com.casi.expense.dto.ExpenseResponse;
import com.casi.expense.entity.Expense;
import org.mapstruct.Mapping;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {

    @Mapping(source = "category.id", target = "categoryId")
    @Mapping(source = "category.name", target = "categoryName")
    ExpenseResponse toResponse(Expense expense);
}
