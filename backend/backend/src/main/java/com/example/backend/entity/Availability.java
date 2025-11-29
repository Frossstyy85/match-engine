package com.example.backend.entity;

import java.time.DayOfWeek;
import java.time.LocalTime;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import lombok.Data;

@Node
@Data
public class Availability {
    @Id @GeneratedValue
    private Long id;

    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;
}
