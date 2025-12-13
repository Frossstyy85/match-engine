package com.example.backend.security;

import com.example.backend.entity.User;
import com.example.backend.exception.UnauthorizedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUser {

    public User get() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth instanceof AnonymousAuthenticationToken) {
            throw new UnauthorizedException("Unauthorized");
        }
        Object principal = auth.getPrincipal();
        if (!(principal instanceof User)) {
            throw new UnauthorizedException("Unauthorized");
        }
        return (User) principal;
    }
}

