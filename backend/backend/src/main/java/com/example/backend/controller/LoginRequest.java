package com.example.backend.controller;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    @NotBlank
    private String email;

    @NotBlank
    private String password;


}
