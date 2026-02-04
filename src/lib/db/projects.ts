"use server";

import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

export async function createProject(formData: FormData) {
    const name = formData.get("name") as string;


    if (!name || name.trim().length === 0) {
        throw new Error("Project name is required");
    }

    const supabase = await createClient();

    const {data, error} = await supabase
        .from("projects")
        .insert({name})
        .select('id')
        .single()

    console.log(data)

    if (error) {
        throw error;
    }

    revalidatePath("/dashboard/projects");

    if (data.id)
        redirect(`/dashboard/projects/${data.id}`)
}

