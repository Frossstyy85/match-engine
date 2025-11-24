import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Kompetenser() {
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        // Exempeldata – byt till API-anrop senare
        setSkills([
            { id: 1, name: "React", level: "Intermediate" },
            { id: 2, name: "Java", level: "Advanced" },
        ]);
    }, []);

    return (
        <div className="p-4">
            <h2>🧠 Kompetenser</h2>
            <table className="table table-striped mt-3">
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
    );
}
