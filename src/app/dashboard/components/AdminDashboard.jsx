"use client"

import React from "react"

export default function AdminDashboard() {

    const data = {
        users: [
            {id: 1, name: "Alice"},
            {id: 2, name: "Bob"},
            {id: 3, name: "Charlie"},
        ],
        projects: [
            {id: 1, name: "Project Alpha"},
            {id: 2, name: "Project Beta"},
            {id: 3, name: "Project Gamma"},
        ],
        teams: [
            {id: 1, name: "Team Rocket"},
            {id: 2, name: "Team Alpha"},
        ],
    }

    const {users, projects, teams} = data

    return (
        <div className="dashboard-container">
            <h2>Admin Dashboard</h2>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h4>Användare</h4>
                    <p>{users.length}</p>
                </div>
                <div className="stat-card">
                    <h4>Projekt</h4>
                    <p>{projects.length}</p>
                </div>
                <div className="stat-card">
                    <h4>Team</h4>
                    <p>{teams.length}</p>
                </div>
            </div>

            <section className="dashboard-section">
                <h3>Projekt</h3>
                <ul className="dashboard-list">
                    {projects.map(({id, name}) => (
                        <li key={id}>{name}</li>
                    ))}
                </ul>
            </section>

            <section className="dashboard-section">
                <h3>Team</h3>
                <ul className="dashboard-list">
                    {teams.map(({id, name}) => (
                        <li key={id}>{name}</li>
                    ))}
                </ul>
            </section>
        </div>
    )
}