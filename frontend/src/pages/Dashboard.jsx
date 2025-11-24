import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        // Exempeldata för Sprint 1 (ersätt med backend API senare)
        setUsers([{ id: 1, name: "Caroline", email: "caroline@test.se" }]);
        setSkills([{ id: 1, name: "React", level: "Intermediate" }]);
        setProjects([{ id: 1, name: "Projekt A", status: "Pågående" }]);
        setTeams([{ id: 1, name: "Team 1", members: 3 }]);
    }, []);

    return (
        <div className="d-flex">

            {/* Sidebar */}
            <aside className="bg-dark text-white p-3" style={{ width: "260px", minHeight: "100vh" }}>
                <h3 className="mb-4">Matchningssystem</h3>
                <ul className="nav flex-column">
                    <li className="nav-item mb-2"><a className="nav-link text-white" href="#dashboard">🏠 Dashboard</a></li>
                    <li className="nav-item mb-2"><a className="nav-link text-white" href="#anvandare">👥 Användare</a></li>
                    <li className="nav-item mb-2"><a className="nav-link text-white" href="#kompetenser">🧠 Kompetenser</a></li>
                    <li className="nav-item mb-2"><a className="nav-link text-white" href="#projekt">📁 Projekt</a></li>
                    <li className="nav-item"><a className="nav-link text-white" href="#team">💼 Team</a></li>
                </ul>
            </aside>

            {/* Main content */}
            <main className="flex-grow-1 p-4">
                <h2 id="dashboard" className="mb-4">Översikt</h2>

                {/* Statistik-kort */}
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Användare</h5>
                                <p className="text-muted">Registrerade individer</p>
                                <h3>{users.length}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Kompetenser</h5>
                                <p className="text-muted">Totala kompetenser</p>
                                <h3>{skills.length}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Projekt</h5>
                                <p className="text-muted">Aktiva projekt</p>
                                <h3>{projects.length}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Team</h5>
                                <p className="text-muted">Skapade team</p>
                                <h3>{teams.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabeller */}
                <section id="anvandare" className="mb-5">
                    <h4>Användare</h4>
                    <table className="table table-striped">
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

                <section id="kompetenser" className="mb-5">
                    <h4>Kompetenser</h4>
                    <table className="table table-striped">
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

                <section id="projekt" className="mb-5">
                    <h4>Projekt</h4>
                    <table className="table table-striped">
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

                <section id="team" className="mb-5">
                    <h4>Team</h4>
                    <table className="table table-striped">
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

            </main>
        </div>
    );
}
