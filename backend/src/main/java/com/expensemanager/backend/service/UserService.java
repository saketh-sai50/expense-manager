package com.expensemanager.backend.service;

import com.expensemanager.backend.entity.User;
import com.expensemanager.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // --- NEW METHOD ADDED ---
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}