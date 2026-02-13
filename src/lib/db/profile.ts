"use server";

import type { User } from "@supabase/auth-js";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const LEVEL_OPTIONS = ["beginner", "intermediate", "advanced"] as const;

export type ProfileRow = { id: string; name: string | null; email: string | null };
export type ProfileSkillRow = { id: number; skill_id: number; name: string; level: string };
export type ProfileLanguageRow = { id: number; language_id: number; name: string };
export type ProfileCertificateRow = { id: number; certificate_id: number; name: string };

function resolveName(
    relation: { name?: string | null } | { name?: string | null }[] | null | undefined
): string {
    if (Array.isArray(relation)) return relation[0]?.name ?? "Unknown";
    return relation?.name ?? "Unknown";
}

export async function getOrCreateProfile(supabase: Awaited<ReturnType<typeof createClient>>, authUser: User): Promise<ProfileRow | null> {
    const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, email")
        .eq("auth_id", authUser.id)
        .limit(1);

    if (profileError) return null;

    let profileRow = profileRows?.[0] ?? null;

    if (!profileRow) {
        const { data: createdProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
                auth_id: authUser.id,
                email: authUser.email ?? null,
                name: authUser.user_metadata?.full_name ?? null,
            })
            .select("id, name, email")
            .single();

        if (createError) return null;
        profileRow = createdProfile;
    } else if (!profileRow.email && authUser.email) {
        const { data: updatedProfile, error: updateError } = await supabase
            .from("profiles")
            .update({ email: authUser.email })
            .eq("id", profileRow.id)
            .select("id, name, email")
            .single();

        if (!updateError && updatedProfile) profileRow = updatedProfile;
    }

    return profileRow;
}

export async function addProfileSkill(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profile = await getOrCreateProfile(supabase, user);
    if (!profile) return;

    const skillId = Number(formData.get("skillId"));
    const skillLevel = String(formData.get("skillLevel") || LEVEL_OPTIONS[0]);
    if (!skillId) return;

    await supabase.from("profile_skills").insert({
        profile_id: profile.id,
        skill_id: skillId,
        skill_level: skillLevel,
    });
    revalidatePath("/dashboard/profile");
}

export async function addProfileLanguage(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profile = await getOrCreateProfile(supabase, user);
    if (!profile) return;

    const languageId = Number(formData.get("languageId"));
    if (!languageId) return;

    await supabase.from("profile_languages").insert({
        profile_id: profile.id,
        language_id: languageId,
    });
    revalidatePath("/dashboard/profile");
}

export async function addProfileCertificate(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const profile = await getOrCreateProfile(supabase, user);
    if (!profile) return;

    const certificateId = Number(formData.get("certificateId"));
    if (!certificateId) return;

    await supabase.from("profile_certificates").insert({
        profile_id: profile.id,
        certificate_id: certificateId,
    });
    revalidatePath("/dashboard/profile");
}

export async function removeProfileSkill(formData: FormData) {
    const rowId = Number(formData.get("rowId"));
    if (!rowId) return;
    const supabase = await createClient();
    await supabase.from("profile_skills").delete().eq("id", rowId);
    revalidatePath("/dashboard/profile");
}

export async function removeProfileLanguage(formData: FormData) {
    const rowId = Number(formData.get("rowId"));
    if (!rowId) return;
    const supabase = await createClient();
    await supabase.from("profile_languages").delete().eq("id", rowId);
    revalidatePath("/dashboard/profile");
}

export async function removeProfileCertificate(formData: FormData) {
    const rowId = Number(formData.get("rowId"));
    if (!rowId) return;
    const supabase = await createClient();
    await supabase.from("profile_certificates").delete().eq("id", rowId);
    revalidatePath("/dashboard/profile");
}
