
package com.careertrack.controller;

import com.careertrack.model.User;
import com.careertrack.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody Map<String, String> request) {

        String name = request.get("name");
        String email = request.get("email");
        String password = request.get("password");

        if (name == null || name.isBlank()
                || email == null || email.isBlank()
                || password == null || password.length() < 8) {
            return ResponseEntity.badRequest().body(
                    Map.of("error",
                            "Name, email, and a password of at least 8 characters are required")
            );
        }

        email = email.trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("error", "Email is already registered")
            );
        }

        User user = new User();
        user.setName(name.trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));

        User savedUser = userRepository.save(user);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "id", savedUser.getId(),
                        "name", savedUser.getName(),
                        "email", savedUser.getEmail()
                )
        );
    }

    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
    String email = request.get("email");
    String password = request.get("password");

    if (email == null || email.isBlank()
            || password == null || password.isBlank()) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", "Email and password are required"));
    }

    User user = userRepository.findByEmail(email.trim().toLowerCase())
            .orElse(null);

    if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Invalid email or password"));
    }

    return ResponseEntity.ok(Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "message", "Login successful"
    ));
}
}
