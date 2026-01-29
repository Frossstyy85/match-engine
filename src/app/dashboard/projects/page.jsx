"use client"

import "@/components/table/table.css";
import {useQueryProjects} from "@/lib/queries";


export default function Page() {


    const { data: projects, isLoading} = useQueryProjects();

    if (isLoading) return <p>loading...</p>

    return (
        <div>
            <h2>Projects</h2>
            <table className="table">
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