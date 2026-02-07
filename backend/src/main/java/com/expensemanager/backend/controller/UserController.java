package com.expensemanager.backend.controller;

import com.expensemanager.backend.entity.User;
import com.expensemanager.backend.security.JwtUtil;
import com.expensemanager.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User loginRequest) {
        // 1. Verify username and password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );

        // 2. If correct, generate Token
        String token = jwtUtil.generateToken(loginRequest.getUsername());

        // 3. Get User Details
        User user = userService.findByUsername(loginRequest.getUsername()).get();

        // 4. Return Token + User Info
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return response;
    }
}