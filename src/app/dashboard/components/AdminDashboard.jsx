"use client";

import {useGraph} from "@/lib/hooks";

export default function AdminDashboard() {

    const query = 'query { teams { id name } projects { id name } users { id name } }'

    const {loading, data, error} = useGraph(query);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const {teams, projects, users} = data;

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
    );
}