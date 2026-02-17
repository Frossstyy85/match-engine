"use server";

import {createClient} from "@/lib/supabase/server";
import {revalidatePath} from "next/cache";

export async function fetchSkillsWithCategories(){
    const supabase = await createClient();
    const { data: skills, error } = await supabase
        .from('skill_categories')
        .select('id, name, skills(id, name)')

    if (error) throw error

    return skills;
}

export async function fetchSkillsWithCategory() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('skills')
        .select('id, name, skill_categories(name)')

    if (error) throw error

    return data;
}

export async function fetchCategories() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('skill_categories')
        .select('id, name')

    if (error) throw error

    return data;
}

export async function fetchSkill(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("skills")
        .select("id, name, category_id, skill_categories(id, name)")
        .eq("id", id)
        .maybeSingle();
    if (error) throw error;
    return data;
}

export async function createSkill(name: string, categoryId: number) {
    if (!name.trim()) throw new Error("Skill name is required")

    const supabase = await createClient();
    const { error } = await supabase
        .from('skills')
        .insert({ name: name.trim(), category_id: categoryId })

    if (error) throw error

    revalidatePath("/dashboard/skills")
}

export async function deleteSkill(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/dashboard/skills");
}