package com.casi.category.mapper;

import com.casi.category.dto.CategoryResponse;
import com.casi.category.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(Category category);
}
