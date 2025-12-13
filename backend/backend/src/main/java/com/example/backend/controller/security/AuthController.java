package com.example.backend.controller.security;

import com.example.backend.controller.GenericResponse;
import com.example.backend.entity.User;
import com.example.backend.security.AuthenticatedUser;
import com.example.backend.service.AuthService;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;
    private final AuthenticatedUser authenticatedUser;

    public AuthController(UserService userService, AuthService authService, AuthenticatedUser authenticatedUser) {
        this.userService = userService;
        this.authService = authService;
        this.authenticatedUser = authenticatedUser;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        var auth = authService.authenticate(request, httpRequest, httpResponse);
        User user = (User) auth.getPrincipal();
        return ResponseEntity.ok(new GenericResponse<>(user));
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(@Valid @RequestBody RegisterRequest request) {
        userService.registerUser(request);
        return ResponseEntity.status(201).build();
    }

    @GetMapping("/session")
    public ResponseEntity<?> currentSession(@AuthenticationPrincipal User principal) {
        if (principal == null) return ResponseEntity.ok(Map.of("Authenticated", false));

        User user = authenticatedUser.get();
        return ResponseEntity.ok(new GenericResponse<>(user));
    }
}
