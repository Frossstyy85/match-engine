package com.example.backend.entity;


import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import java.util.List;

@Node
@Data
public class Team {

    @Id
    @GeneratedValue
    private Long id;

    private String name;

    @Relationship(type = "HAS_MEMBER")
    private List<User> members;

    @Relationship(type = "NEEDS_SKILL")
    private List<SkillProperty> missingSkills;
}
