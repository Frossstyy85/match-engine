import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./Dashboard.css";

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        setUsers([{ id: 1, name: "Caroline", email: "caroline@test.se" }]);
        setSkills([{ id: 1, name: "React", level: "Intermediate" }]);
        setProjects([{ id: 1, name: "Projekt A", status: "Pågående" }]);
        setTeams([{ id: 1, name: "Team 1", members: 3 }]);
    }, []);

    return (
        <Layout>
            <div className="dashboard-container">
                <h2>🏠 Översikt</h2>

                {/* Statistik-kort */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <h5>Användare</h5>
                        <p>Registrerade individer</p>
                        <h3>{users.length}</h3>
                    </div>
                    <div className="stat-card">
                        <h5>Kompetenser</h5>
                        <p>Totala kompetenser</p>
                        <h3>{skills.length}</h3>
                    </div>
                    <div className="stat-card">
                        <h5>Projekt</h5>
                        <p>Aktiva projekt</p>
                        <h3>{projects.length}</h3>
                    </div>
                    <div className="stat-card">
                        <h5>Team</h5>
                        <p>Skapade team</p>
                        <h3>{teams.length}</h3>
                    </div>
                </div>

                {/* Tabeller */}
                <section className="table-section">
                    <h4>Användare</h4>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Namn</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section className="table-section">
                    <h4>Kompetenser</h4>
                    <table className="dashboard-table">
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
                </section>

                <section className="table-section">
                    <h4>Projekt</h4>
                    <table className="dashboard-table">
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
                </section>

                <section className="table-section">
                    <h4>Team</h4>
                    <table className="dashboard-table">
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
                </section>
            </div>
        </Layout>
    );
}
