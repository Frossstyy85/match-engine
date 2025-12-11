package com.example.backend.controller;

import jakarta.validation.constraints.NotBlank;
public class RegisterRequest {



    @NotBlank
    private String name;

    @NotBlank
    private String email;

    @NotBlank
    private String password;


    public String getName() {
        return name;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }




}
