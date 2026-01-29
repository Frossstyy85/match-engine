"use client"

import "@/components/table/table.css";
import {supabase} from "@/lib/supabase/client";
import {useQuery} from "@tanstack/react-query";


async function getProjects() {
    const {data} = await supabase
        .from('projects')
        .select()
    return data
}

export default function Page() {


    const {data: projects, isLoading} = useQuery({
        queryKey: ['all_projects'],
        queryFn: getProjects
    })

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