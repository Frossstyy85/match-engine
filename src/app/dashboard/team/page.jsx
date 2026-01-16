"use client";

import React, { useEffect, useState } from "react";
import "./page.css";

import {useGraph} from "@/lib/hooks";

export default function Team() {


    const { data, error, loading } = useGraph('query { teams { id name users { id } } }')

    if (loading) return <div>Loading...</div>
    if (error) return <div>{error.message}</div>

    const teams = data.teams;

    return (
        <div className="projekt-container">
            <h2>💼 Team</h2>
            <table className="projekt-table">
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
                        <td>{team.users.length}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
