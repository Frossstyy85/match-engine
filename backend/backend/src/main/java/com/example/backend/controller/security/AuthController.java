package com.example.backend.controller.security;

import com.example.backend.api.ApiResponse;
import com.example.backend.api.ResponseFactory;
import com.example.backend.entity.User;
import com.example.backend.security.CustomUserDetail;
import com.example.backend.service.user.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final SecurityContextRepository securityContextRepository;

    public AuthController(AuthenticationManager authenticationManager, UserService userService, SecurityContextRepository securityContextRepository) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.securityContextRepository = securityContextRepository;
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseFactory.noContent();
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<User>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest, HttpServletResponse httpResponse) {
        Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        CustomUserDetail principal = (CustomUserDetail) auth.getPrincipal();
        User user = userService.findUser(principal.id());
        return ResponseFactory.ok(user, httpRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<Void>> register(@Valid @RequestBody RegisterRequest request, HttpServletRequest httpRequest) {
        userService.registerUser(request);
        return ResponseFactory.created("User registered", httpRequest);
    }

    @GetMapping("/session")
    public ResponseEntity<ApiResponse<User>> currentSession(@AuthenticationPrincipal CustomUserDetail userDetail, HttpServletRequest httpRequest) {
        if (userDetail == null) return ResponseFactory.ok(null, httpRequest);

        User user = userService.findUser(userDetail.id());
        return ResponseFactory.ok(user, httpRequest);
    }
}
