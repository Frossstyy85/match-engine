"use client";

import React, { useEffect, useState } from "react";
import "./page.css"

export default function Team() {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        setTeams([
            { id: 1, name: "Team 1", members: 3 },
            { id: 2, name: "Team 2", members: 4 },
        ]);
    }, []);

    return (
        <div className="p-4">
            <h2>💼 Team</h2>
            <table className="table table-striped mt-3">
                <thead>
                <tr>
                    <th>Team</th>
                    <th>Antal medlemmar</th>
                </tr>
                </thead>
                <tbody>
                {teams.map(team => (
                    <tr key={team.id}>
                        <td>{team.name}</td>
                        <td>{team.members}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}