package com.example.backend.entity;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import java.time.LocalDate;

@Node
@Data
public class Certificate {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String issuer;
    private LocalDate date;
}