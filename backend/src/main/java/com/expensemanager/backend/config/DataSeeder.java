package com.expensemanager.backend.config;

import com.expensemanager.backend.entity.Category;
import com.expensemanager.backend.entity.User;
import com.expensemanager.backend.enums.Role;
import com.expensemanager.backend.repository.CategoryRepository;
import com.expensemanager.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public DataSeeder(UserRepository userRepository, CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        // 1. Create ALL Required Categories
        // These must match your Frontend Dropdown EXACTLY
        List<String> requiredCategories = Arrays.asList(
                "Food",
                "Travel",
                "Office Supplies",
                "Utilities",      // <-- New!
                "Medical",        // <-- New!
                "Entertainment"   // <-- New!
        );

        for (String catName : requiredCategories) {
            // Only create if it doesn't exist yet
            if (categoryRepository.findByName(catName).isEmpty()) {
                Category newCat = new Category();
                newCat.setName(catName);
                newCat.setDescription("Expenses for " + catName);
                categoryRepository.save(newCat);
                System.out.println("✅ Data Seeder: Added missing category -> " + catName);
            }
        }

        // 2. Create Users if they don't exist (Keep your original logic)
        if (userRepository.count() == 0) {
            User manager = new User();
            manager.setFullName("Saketh Manager");
            manager.setUsername("manager@test.com");
            manager.setPassword("password123");
            manager.setRole(Role.ROLE_MANAGER);

            User employee = new User();
            employee.setFullName("Rahul Employee");
            employee.setUsername("employee@test.com");
            employee.setPassword("password123");
            employee.setRole(Role.ROLE_EMPLOYEE);

            userRepository.saveAll(Arrays.asList(manager, employee));
            System.out.println("✅ Data Seeder: Created Initial Users!");
        }
    }
}