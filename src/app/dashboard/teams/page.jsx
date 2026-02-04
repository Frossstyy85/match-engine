"use client"

import "@/components/table/table.css";
import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/lib/supabase/client";
import CreateTeamForm from "@/app/dashboard/teams/CreateTeamForm";

async function getTeams() {
    const {data} = await supabase
        .from('teams')
        .select()
    return data
}

export default function Page() {


    const {data: teams, isLoading} = useQuery({
        queryKey: ['all_teams'],
        queryFn: getTeams
    })

    if (isLoading) return <p>loading...</p>


    return (
        <div>
            <h2>Team</h2>
            <CreateTeamForm/>
            <table className="table">
                <thead>
                <tr>
                    <th>Team</th>
                </tr>
                </thead>
                <tbody>
                {teams.map(team => (
                    <tr key={team.id}>
                        <td>{team.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
