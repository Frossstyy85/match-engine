"use client";

import "@/components/table/table.css";
import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase/client";


async function getSkills() {
    const {data} = await supabase
        .from('skills')
        .select()
    return data
}

export default function Page() {


    const {data: skills, isLoading} = useQuery({
        queryKey: ['all_skills'],
        queryFn: getSkills
    })

    if (isLoading) return <p>loading...</p>

    return (
        <div>
            <h2>Skills</h2>

            <table className="table">
                <thead>
                <tr>
                    <th>Skill</th>
                </tr>
                </thead>
                <tbody>
                {skills.map(skill => (
                    <tr key={skill.id}>
                        <td>{skill.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}