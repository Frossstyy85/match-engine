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

