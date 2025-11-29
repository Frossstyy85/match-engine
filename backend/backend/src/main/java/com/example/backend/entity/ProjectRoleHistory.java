package com.example.backend.entity;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDate;

@Node
@Data
public class ProjectRoleHistory {
    @Id
    @GeneratedValue
    private Long id;
    @Relationship(type = "IN_PROJECT")
    private Project project;

    private String roleName;
    private LocalDate startDate;
    private LocalDate endDate;
}