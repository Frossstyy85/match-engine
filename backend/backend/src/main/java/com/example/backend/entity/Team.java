package com.example.backend.entity;

import jakarta.persistence.*;

import java.util.List;


@Entity
public class Team {

    @Id @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @OneToMany
    private List<User> users;


}
