"use client";

import React, { useEffect, useState } from "react";
import "./page.css";
import {useQuery} from "@apollo/client/react";
import {gql} from "graphql-tag";

export default function Kompetenser() {


    const { data, error, loading } = useQuery(gql(`query { skills { name id } }`))


    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    const skills = data.skills;

    return (
            <div className="kompetenser-container">
                <h2>🧠 Kompetenser</h2>

                <table className="kompetenser-table">
                    <thead>
                    <tr>
                        <th>Kompetens</th>
                        <th>Nivå</th>
                    </tr>
                    </thead>
                    <tbody>
                    {skills.map(skill => (
                        <tr key={skill.id}>
                            <td>{skill.name}</td>
                            <td>{skill.level}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
    );
}