"use client"

import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase/client";
import {useParams} from "next/navigation"

async function createRequirement(){

}

async function updateRequirement(){

}


export default function Page(){

    const { id } = useParams();

    const skillsQuery = useQuery({
        queryKey: ['skills'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('skills')
                .select()
            if (error) throw error
            return data
        }
    })

    const projectsQuery = useQuery({
        queryKey: ['project', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('id, name, status, profiles(id, name, email ), project_requirements(*)')
                .eq("id", id)
                .single()
            if (error) throw error
            return data
        }
    })

    if (projectsQuery.isLoading || skillsQuery.isLoading) return <p>loading...</p>


    return (
        <div>
            <pre>{JSON.stringify(projectsQuery.data, null, 3)}</pre>
            <pre>{JSON.stringify(skillsQuery.data, null, 3)}</pre>
        </div>
    )


}