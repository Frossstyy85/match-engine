import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import "./Kompetenser.css";

export default function Kompetenser() {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        // Exempeldata – byt ut mot API-anrop senare
        setSkills([
            { id: 1, name: "React", level: "Intermediate" },
            { id: 2, name: "Java", level: "Advanced" },
        ]);
    }, []);

    return (
        <Layout>
            <div className="kompetenser-container">
                <h2>🧠 Kompetenser</h2>

                <table className="kompetenser-table">
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
        </Layout>
    );
}
