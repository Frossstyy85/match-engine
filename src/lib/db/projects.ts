"use server";

import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {supabase} from "@/lib/supabase/client";

export async function createProject(formData: FormData) {
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string)?.trim() || null;
    const start_date = (formData.get("start_date") as string) || null;
    const end_date = (formData.get("end_date") as string) || null;

    if (!name || name.trim().length === 0) {
        throw new Error("Project name is required");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("projects")
        .insert({
            name: name.trim(),
            description: description || null,
            start_date: start_date || null,
            end_date: end_date || null,
        })
        .select("id")
        .single()

    if (error) {
        throw error;
    }

    revalidatePath("/dashboard/projects");

    if (data.id)
        redirect(`/dashboard/projects/${data.id}`)
}

export async function updateProject(
    id: number,
    fields: {
        name: string
        description?: string
        start_date?: string | null
        end_date?: string | null
    },
    skillNames: string[]
) {
    const supabase = await createClient();

    const { error: projectError } = await supabase
        .from('projects')
        .update({
            name: fields.name,
            description: fields.description || null,
            start_date: fields.start_date || null,
            end_date: fields.end_date || null,
        })
        .eq('id', id)

    if (projectError) throw projectError

    const { error: deleteError } = await supabase
        .from('project_skills')
        .delete()
        .eq('project_id', id)

    if (deleteError) throw deleteError

    if (skillNames.length > 0) {
        const { data: skillRows, error: skillsError } = await supabase
            .from('skills')
            .select('id')
            .in('name', skillNames)

        if (skillsError) throw skillsError

        if (skillRows && skillRows.length > 0) {
            const { error: insertError } = await supabase
                .from('project_skills')
                .insert(skillRows.map((s) => ({ project_id: id, skill_id: s.id })))

            if (insertError) throw insertError
        }
    }

    revalidatePath(`/dashboard/projects/${id}`)
    revalidatePath(`/dashboard/projects/${id}/edit`)
}

export async function deleteProject(id: number) {
    const supabase = await createClient();

    // Delete related teams first to satisfy foreign key constraint
    const { error: teamsError } = await supabase
        .from("teams")
        .delete()
        .eq("project_id", id);

    if (teamsError) throw teamsError;

    const { error: projectError } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);

    if (projectError) throw projectError;

    revalidatePath("/dashboard/projects");
    redirect("/dashboard/projects");
}

export async function fetchProject(id: number){
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('projects')
        .select("*, project_skills(skills(id, name)), teams(id, name)")
        .eq('id', id)
        .maybeSingle()

    if (error) throw error

    if (!data) {
        return null;
    }

    const projectSkills = (data.project_skills ?? []).map(
        (ps: { skills?: { name?: string } | null }) => ps.skills?.name ?? null
    ).filter((n): n is string => Boolean(n))

    return { ...data, projectSkills };
}

export async function deleteProject(id: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", id);


    if (error) throw error

    revalidatePath("dashboard/projects")
    revalidatePath(`dashboard/projects${id}`)
    revalidatePath(`dashboard/projects${id}/edit`)
}

