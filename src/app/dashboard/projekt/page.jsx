"use client";
import React, { useEffect, useState } from "react";
import "./page.css"

export default function Projekt() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects([
            { id: 1, name: "Projekt A", status: "Pågående" },
            { id: 2, name: "Projekt B", status: "Planeras" },
        ]);
    }, []);

    return (
            <div className="projekt-container">
                <h2>📁 Projekt</h2>

                <table className="projekt-table">
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