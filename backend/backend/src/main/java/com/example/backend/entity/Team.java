package com.example.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Data;

import java.util.List;

@Data
@Entity
public class Team {

    @Id
    private Long id;

    @OneToMany
    private List<User> users;


}
