package com.expensemanager.backend.service;

import com.expensemanager.backend.entity.Category;
import com.expensemanager.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public Category createCategory(Category category) {
        if (categoryRepository.findByName(category.getName()).isPresent()) {
            // If it exists, just return the existing one (don't crash)
            return categoryRepository.findByName(category.getName()).get();
        }
        return categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Category not found: " + name));
    }
}