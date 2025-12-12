package com.example.backend.api;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ResponseFactory {
    private ResponseFactory() {
    }

    public static <T> ResponseEntity<ApiResponse<T>> ok(T data, HttpServletRequest request) {
        return ResponseEntity.ok(ApiResponse.of(null, data, request.getRequestURI()));
    }

    public static ResponseEntity<ApiResponse<Void>> created(String message, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(message, null, request.getRequestURI()));
    }

    public static ResponseEntity<Void> noContent() {
        return ResponseEntity.noContent().build();
    }

    public static ResponseEntity<ApiResponse<Void>> message(HttpStatus status, String message, HttpServletRequest request) {
        return ResponseEntity.status(status)
                .body(ApiResponse.of(message, null, request.getRequestURI()));
    }

    public static ResponseEntity<ApiResponse<Void>> error(HttpStatus status, String message, HttpServletRequest request) {
        return ResponseEntity.status(status)
                .body(ApiResponse.of(message, null, request != null ? request.getRequestURI() : null));
    }
}
