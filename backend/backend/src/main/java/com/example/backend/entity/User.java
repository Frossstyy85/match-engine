package com.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Data;



@Entity
@Data
public class User {

    @Id @GeneratedValue
    private Long id;

    private String name;
    private String email;
    private Role role;

    @JsonIgnore
    private String password;


}