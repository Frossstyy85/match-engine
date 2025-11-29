package com.example.backend.entity;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import java.util.List;


@Node
@Data
public class User {

    @Id @GeneratedValue
    private Long id;

    private String name;
    private String email;
    private Role role;

    @Relationship(type = "HAS_SKILL")
    private List<SkillProperty> skills;

    @Relationship(type = "HAS_CERTIFICATE")
    private List<Certificate> certificates;

    @Relationship(type = "SPEAKS")
    private List<Language> languages;

    @Relationship(type = "INTERESTED_IN")
    private List<Interest> interests;

    @Relationship(type = "AVAILABLE_AT")
    private List<Availability> availability;

    @Relationship(type = "WORKED_ON")
    private List<ProjectRoleHistory> projectHistory;
}