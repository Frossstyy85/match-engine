    package com.example.backend.controller;

    import jakarta.servlet.http.HttpServlet;
    import jakarta.servlet.http.HttpSession;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.security.authentication.AnonymousAuthenticationToken;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.AuthenticationException;
    import org.springframework.security.core.context.SecurityContextHolder;
    import org.springframework.web.bind.annotation.*;

    import java.util.Map;

    @RestController
    @RequestMapping(path = "/auth")
    public class AuthController {

        private final AuthenticationManager authenticationManager;

        public AuthController(AuthenticationManager authenticationManager){
            this.authenticationManager = authenticationManager;
        }

        @PostMapping("/logout")
        public ResponseEntity<?> logout(HttpSession session) {
            session.invalidate();
            return ResponseEntity.ok().body("{\"status\":\"logged_out\"}");
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody LoginRequest login, HttpSession session) {

            try {
                Authentication auth = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(login.getEmail(), login.getPassword())
                );

                SecurityContextHolder.getContext().setAuthentication(auth);
                session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

                return ResponseEntity.ok(Map.of("status", "ok"));

            } catch (AuthenticationException e) {
                return ResponseEntity.status(401).body(Map.of("error", "invalid_credentials"));
            }
        }


        @GetMapping("/hello")
        public String hello(){
            return "hello";
        }

        @GetMapping("/me")
        public ResponseEntity<?> currentUser() {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();

            if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
                return ResponseEntity.status(401).body(Map.of("authenticated", false));
            }

            return ResponseEntity.ok(Map.of(
                    "authenticated", true,
                    "username", auth.getName(),
                    "roles", auth.getAuthorities()
            ));
        }











    }
