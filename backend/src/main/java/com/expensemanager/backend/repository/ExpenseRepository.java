package com.expensemanager.backend.repository;
import com.expensemanager.backend.entity.ExpenseClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<ExpenseClaim, Long> {
    List<ExpenseClaim> findByUserId(Long userId);
}