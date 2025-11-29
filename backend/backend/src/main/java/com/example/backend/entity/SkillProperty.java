package com.example.backend.entity;

import lombok.Data;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;


@RelationshipProperties
@Data
public class SkillProperty {


    @Id @GeneratedValue
    private Long id;

    @TargetNode
    private Skill skill;

    private Level level;


}
