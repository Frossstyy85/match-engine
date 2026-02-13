"use server";

import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function createTeam(formData: FormData) {
    const name = formData.get("name") as string;

    if (!name || name.trim().length === 0) {
        throw new Error("Team name is required");
    }

    const supabase = await createClient();

    const {data: {id}, error} = await supabase
        .from("teams")
        .insert({name})
        .select('id')
        .single()


    if (error) {
        throw error;
    }

    revalidatePath("/dashboard/teams");

    if (id)
        redirect(`/dashboard/teams/${id}`)
}

export async function createTeamForProject(projectId: number, formData: FormData) {
    const name = (formData.get("name") as string)?.trim();

    if (!name) {
        throw new Error("Team name is required");
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from("teams")
        .insert({ name, project_id: projectId })
        .select("id")
        .single();

    if (error) throw error;

    revalidatePath("/dashboard/teams");
    revalidatePath(`/dashboard/projects/${projectId}`);
    revalidatePath(`/dashboard/projects/${projectId}/edit`);
}

export async function deleteTeam(teamId: number) {
    const supabase = await createClient();

    const { data: team, error: fetchError } = await supabase
        .from("teams")
        .select("project_id")
        .eq("id", teamId)
        .single();

    if (fetchError) throw fetchError;

    const { error: deleteError } = await supabase
        .from("teams")
        .delete()
        .eq("id", teamId);

    if (deleteError) throw deleteError;

    revalidatePath("/dashboard/teams");
    if (team?.project_id != null) {
        revalidatePath(`/dashboard/projects/${team.project_id}`);
        revalidatePath(`/dashboard/projects/${team.project_id}/edit`);
    }
}