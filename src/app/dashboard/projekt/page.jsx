"use client";
import React, { useEffect, useState } from "react";
import "@/components/table/table.css";

import {useGraph} from "@/lib/hooks";

export default function Projekt() {


    const { loading, data, error } = useGraph('query { projects { id name status } }');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const projects = data.projects;

    return (
            <div>
                <h2>Projekt</h2>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Projekt</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.name}</td>
                            <td>{project.status}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
    );
}