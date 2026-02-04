"use client"

import "@/components/table/table.css";
import {useQueryProjects} from "@/lib/queries";
import {Button} from "@/components/ui/button";
import CreateProjectForm from "@/app/dashboard/projects/CreateProjectForm";


export default function Page() {


    const { data: projects, isLoading} = useQueryProjects();

    const date = new Date()

    if (isLoading) return <p>loading...</p>

    return (
        <div>
            <h2>Projects</h2>
            <CreateProjectForm/>
            <table className="table">
                <thead>
                <tr>
                    <th>Projekt</th>
                    <th>Status</th>
                    <th>start date</th>
                    <th>end date</th>
                    <th>project lead</th>
                </tr>
                </thead>
                <tbody>
                {projects.map(project => (
                    <tr key={project.id}>
                        <td>{project.name}</td>
                        <td>{project.status}</td>
                        <td>{project.start_date}</td>
                        <td>{project.end_date}</td>
                        <td>empty</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}