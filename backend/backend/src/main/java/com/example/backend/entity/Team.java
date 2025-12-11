package com.example.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;


import java.util.List;


@Entity
public class Team {

    @Id
    private Long id;

    @OneToMany
    private List<User> users;


}
