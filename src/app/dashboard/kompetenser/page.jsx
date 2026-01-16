"use client";

import React, { useEffect, useState } from "react";
import "@/components/table/table.css";
import {useGraph} from "@/lib/hooks";

export default function Kompetenser() {


    const { data, error, loading } = useGraph('query { skills { id name } }');


    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    const skills = data.skills;

    return (
            <div>
                <h2>Kompetenser</h2>

                <table className="table">
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