package com.expensemanager.backend.controller;

import com.expensemanager.backend.entity.ExpenseClaim;
import com.expensemanager.backend.entity.User;
import com.expensemanager.backend.entity.Category;
import com.expensemanager.backend.enums.ExpenseStatus;
import com.expensemanager.backend.service.CategoryService;
import com.expensemanager.backend.service.ExpenseService;
import com.expensemanager.backend.service.S3Service;
import com.expensemanager.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal; // <--- IMPORT THIS
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin("*")
public class ExpenseController {

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private UserService userService;

    @Autowired
    private CategoryService categoryService;

    // 1. Get All Expenses
    @GetMapping
    public List<ExpenseClaim> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    // 2. Create New Expense
    @PostMapping(consumes = {"multipart/form-data"})
    public ExpenseClaim createExpense(
            @RequestParam("description") String description,
            @RequestParam("amount") Double amount, // Input is Double
            @RequestParam("categoryName") String categoryName,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "receipt", required = false) MultipartFile receiptFile
    ) throws IOException {

        // A. Create the Expense Object
        ExpenseClaim expense = new ExpenseClaim();
        expense.setDescription(description);

        // --- FIX: Convert Double to BigDecimal ---
        expense.setAmount(BigDecimal.valueOf(amount));
        // -----------------------------------------

        expense.setStatus(ExpenseStatus.PENDING);

        // B. Find and Set the User
        Optional<User> userOptional = userService.findById(userId);
        if (userOptional.isPresent()) {
            expense.setUser(userOptional.get());
        } else {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        // C. Find and Set the Category
        Category category = categoryService.getCategoryByName(categoryName);
        if (category == null) {
            throw new RuntimeException("Category not found: " + categoryName);
        }
        expense.setCategory(category);

        // D. UPLOAD TO AWS S3
        if (receiptFile != null && !receiptFile.isEmpty()) {
            String url = s3Service.uploadFile(receiptFile);
            System.out.println("✅ Image uploaded to S3: " + url);
            expense.setReceiptUrl(url);
        }

        // E. Save
        return expenseService.createExpense(expense);
    }

    // 3. Get Expenses for One User
    @GetMapping("/user/{userId}")
    public List<ExpenseClaim> getExpensesByUser(@PathVariable Long userId) {
        return expenseService.getExpensesByUser(userId);
    }

    // 4. Approve or Reject Expense
    @PutMapping("/{id}/{status}")
    public ExpenseClaim updateStatus(@PathVariable Long id, @PathVariable String status) {
        ExpenseStatus newStatus = ExpenseStatus.valueOf(status.toUpperCase());
        return expenseService.updateExpenseStatus(id, newStatus);
    }
}