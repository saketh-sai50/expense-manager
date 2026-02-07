package com.expensemanager.backend.service;

import com.expensemanager.backend.entity.ExpenseClaim;
import com.expensemanager.backend.entity.User;
import com.expensemanager.backend.entity.Category;
import com.expensemanager.backend.enums.ExpenseStatus;
import com.expensemanager.backend.repository.ExpenseRepository;
import com.expensemanager.backend.repository.UserRepository;
import com.expensemanager.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private EmailService emailService;

    // --- NEW SIMPLER METHOD ADDED ---
    // This is used when the Controller has already set the User and Category
    public ExpenseClaim createExpense(ExpenseClaim expense) {
        return expenseRepository.save(expense);
    }

    // (Old method - you can keep it or delete it, but the Controller uses the one above now)
    public ExpenseClaim createExpense(Long userId, Long categoryId, ExpenseClaim expense) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        expense.setUser(user);
        expense.setCategory(category);
        expense.setStatus(ExpenseStatus.PENDING);

        return expenseRepository.save(expense);
    }

    public List<ExpenseClaim> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    public List<ExpenseClaim> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public ExpenseClaim updateExpenseStatus(Long id, ExpenseStatus status) {
        ExpenseClaim expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        expense.setStatus(status);
        ExpenseClaim savedExpense = expenseRepository.save(expense);

        // Email Logic
        try {
            String toEmail = expense.getUser().getUsername();
            String subject = "Expense Update: #" + expense.getId();

            // Updated "Friendly" Email Body
            String body = "Hi " + expense.getUser().getFullName() + ",\n\n" +
                    "Good news! The Manager has reviewed your expense request.\n" +
                    "------------------------------------------------\n" +
                    "Description: " + expense.getDescription() + "\n" +
                    "Amount:      ₹" + expense.getAmount() + "\n" +
                    "Status:      " + status + " " + (status == ExpenseStatus.APPROVED ? "✅" : "❌") + "\n" +
                    "------------------------------------------------\n\n" +
                    "Please login to the dashboard to view more details.\n\n" +
                    "Best Regards,\nYour Expense Manager System";

            emailService.sendStatusEmail(toEmail, subject, body);
        } catch (Exception e) {
            System.out.println("⚠️ Could not send email (Network error?), but status saved.");
        }

        return savedExpense;
    }
}