package com.casi.category.service;

import com.casi.category.dto.CategoryResponse;
import com.casi.category.entity.Category;
import com.casi.category.mapper.CategoryMapper;
import com.casi.category.repository.CategoryRepository;
import com.casi.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    /**
     * Internal helper for Expense/Budget services — throws if the referenced
     * category doesn't exist, matching FR-3's "categoryId must exist" rule.
     */
    public Category getCategoryOrThrow(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found: " + categoryId));
    }
}
