package com.example.backend.controller.user;

public record UserUpdateDto(
        String name,
        String email,
        String password
) {
}
