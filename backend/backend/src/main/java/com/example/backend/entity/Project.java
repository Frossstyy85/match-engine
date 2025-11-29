package com.example.backend.entity;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.time.LocalDate;
import java.util.List;

@Node
@Data
public class Project {

    @Id
    @GeneratedValue
    private Long id;

    private String name;
    private LocalDate startDate;
    private LocalDate endDate;

    @Relationship(type = "REQUIRES")
    private List<ProjectSkillRequirement> requirements;

    @Relationship(type = "HAS_TEAM")
    private List<Team> teams;
}