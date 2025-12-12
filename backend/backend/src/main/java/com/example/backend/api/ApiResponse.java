package com.example.backend.api;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.Instant;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ApiResponse<T>(
        String message,
        T data,
        Instant timestamp,
        String path
) {
    public static <T> ApiResponse<T> of(String message, T data, String path) {
        return new ApiResponse<>(message, data, Instant.now(), path);
    }
}
