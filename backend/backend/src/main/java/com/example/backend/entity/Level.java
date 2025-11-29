package com.example.backend.entity;


import lombok.Getter;

@Getter
public enum Level {

    BASIC(0),
    INTERMEDIATE(1),
    ADVANCED(2);

    private final int value;

    Level(int value) {
        this.value = value;
    }
}

