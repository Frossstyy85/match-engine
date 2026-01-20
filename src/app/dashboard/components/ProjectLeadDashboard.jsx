"use client";
import { useState } from "react";

/* ===== MOCK USERS ===== */
const users = [
    { name: "Anna", skills: [{ name: "React", level: "Advanced" }] },
    { name: "Erik", skills: [{ name: "Java", level: "Advanced" }] },
    { name: "Sara", skills: [{ name: "Python", level: "Advanced" }] },
];

const skillOptions = ["React", "Java", "Python", "SQL"];
const levelOptions = ["Basic", "Intermediate", "Advanced"];
const capacityOptions = ["Låg", "Medel", "Hög"];

const levelScore = { Basic: 1, Intermediate: 2, Advanced: 3 };

export default function ProjectDashboard() {
    /* ===== PROJECTS ===== */
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");

    /* ===== TEAMS ===== */
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState("");

    /* ===== PROJECT FORM ===== */
    const [projectName, setProjectName] = useState("");
    const [rolesNeeded, setRolesNeeded] = useState("");
    const [experience, setExperience] = useState("");
    const [reqSkill, setReqSkill] = useState("");
    const [reqLevel, setReqLevel] = useState("Intermediate");
    const [competenceReqs, setCompetenceReqs] = useState([]);

    /* ===== TEAM FORM ===== */
    const [teamName, setTeamName] = useState("");
    const [teamSkill, setTeamSkill] = useState("");
    const [teamCapacity, setTeamCapacity] = useState("");

    /* ===== HELPERS ===== */
    const addProject = () => {
        if (!projectName) return;
        setProjects([
            ...projects,
            { name: projectName, rolesNeeded, experience, competenceReqs },
        ]);
        setProjectName("");
        setRolesNeeded("");
        setExperience("");
        setCompetenceReqs([]);
    };

    const addTeam = () => {
        if (!teamName) return;
        setTeams([...teams, { name: teamName, skill: teamSkill, capacity: teamCapacity }]);
        setTeamName("");
        setTeamSkill("");
        setTeamCapacity("");
    };

    const removeItem = (list, setList, index) => {
        const copy = [...list];
        copy.splice(index, 1);
        setList(copy);
    };

    const calculateMatch = (user, project) => {
        if (!project) return 0;
        let score = 0;

        project.competenceReqs.forEach(req => {
            const match = user.skills.find(s => s.name === req.name);
            if (match) {
                score += Math.min(levelScore[match.level], levelScore[req.level]);
            }
        });

        return Math.round((score / (project.competenceReqs.length * 3 || 1)) * 100);
    };

    const activeProject = projects.find(p => p.name === selectedProject);

    return (
        <div className="dashboard-container">
            <h2>Projekt & Team Dashboard</h2>

            {/* ================= PROJECTS ================= */}
            <section className="dashboard-section">
                <h3>📁 Projekt</h3>

                <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                    <option value="">Välj projekt</option>
                    {projects.map((p, i) => (
                        <option key={i}>{p.name}</option>
                    ))}
                </select>

                <h4>Skapa projekt</h4>
                <input placeholder="Projektnamn" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                <select value={rolesNeeded} onChange={(e) => setRolesNeeded(e.target.value)}>
                    <option value="">Antal roller</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3+</option>
                </select>

                <select value={experience} onChange={(e) => setExperience(e.target.value)}>
                    <option value="">Erfarenhetskrav</option>
                    <option>Junior</option>
                    <option>Mid</option>
                    <option>Senior</option>
                </select>

                <h4>Kompetenskrav</h4>
                <select value={reqSkill} onChange={(e) => setReqSkill(e.target.value)}>
                    <option value="">Välj kompetens</option>
                    {skillOptions.map(s => <option key={s}>{s}</option>)}
                </select>

                <select value={reqLevel} onChange={(e) => setReqLevel(e.target.value)}>
                    {levelOptions.map(l => <option key={l}>{l}</option>)}
                </select>

                <button onClick={() => {
                    if (!reqSkill) return;
                    setCompetenceReqs([...competenceReqs, { name: reqSkill, level: reqLevel }]);
                    setReqSkill("");
                }}>Lägg till krav</button>

                <ul className="dashboard-list">
                    {competenceReqs.map((c, i) => (
                        <li key={i}>
                            {c.name} – {c.level}
                            <button onClick={() => removeItem(competenceReqs, setCompetenceReqs, i)}>🗑</button>
                        </li>
                    ))}
                </ul>

                <button className="primary" onClick={addProject}>Spara projekt</button>
            </section>

            {/* ================= TEAMS ================= */}
            <section className="dashboard-section">
                <h3>👥 Team</h3>

                <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                    <option value="">Välj team</option>
                    {teams.map((t, i) => (
                        <option key={i}>{t.name}</option>
                    ))}
                </select>

                <h4>Skapa team</h4>
                <input placeholder="Teamnamn" value={teamName} onChange={(e) => setTeamName(e.target.value)} />

                <select value={teamSkill} onChange={(e) => setTeamSkill(e.target.value)}>
                    <option value="">Teamets huvudkompetens</option>
                    {skillOptions.map(s => <option key={s}>{s}</option>)}
                </select>

                <select value={teamCapacity} onChange={(e) => setTeamCapacity(e.target.value)}>
                    <option value="">Kapacitet</option>
                    {capacityOptions.map(c => <option key={c}>{c}</option>)}
                </select>

                <button onClick={addTeam}>Skapa team</button>

                <ul className="dashboard-list">
                    {teams.map((t, i) => (
                        <li key={i}>
                            {t.name} – {t.skill} – {t.capacity}
                            <button onClick={() => removeItem(teams, setTeams, i)}>🗑</button>
                        </li>
                    ))}
                </ul>
            </section>

            {/* ================= MATCHING ================= */}
            {activeProject && (
                <section className="dashboard-section">
                    <h3>🤝 Matchning mot {activeProject.name}</h3>
                    <ul className="dashboard-list">
                        {users.map((u, i) => {
                            const match = calculateMatch(u, activeProject);
                            const color = match > 70 ? "green" : match > 40 ? "orange" : "red";
                            return <li key={i} style={{ color }}>{u.name} – {match}%</li>;
                        })}
                    </ul>
                </section>
            )}
        </div>
    );
}


