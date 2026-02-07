package com.expensemanager.backend.controller;

import com.expensemanager.backend.entity.Category;
import com.expensemanager.backend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Tells Spring this class handles API requests
@RequestMapping("/api/categories") // The "Address" of this controller
@CrossOrigin("*") // Allows frontend/Postman to access it without blocking
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    // 1. Get All Categories (GET http://localhost:8080/api/categories)
    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    // 2. Create a new Category (POST http://localhost:8080/api/categories)
    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }
}