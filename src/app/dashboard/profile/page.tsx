import {createClient} from "@/lib/supabase/server";
import type {User} from "@supabase/auth-js";
import type {ReactNode} from "react";
import {revalidatePath} from "next/cache";

const levelOptions = ["beginner", "intermediate", "advanced"];

type ProfileRow = { id: string; name: string | null; email: string | null };
type BaseOption = { id: number; name: string | null };
type SkillRow = { id: number; skill_id: number; name: string; level: string };
type LanguageRow = { id: number; language_id: number; name: string };
type CertificateRow = { id: number; certificate_id: number; name: string };

const resolveName = (
    relation: { name?: string | null } | { name?: string | null }[] | null | undefined
) => {
    if (Array.isArray(relation)) {
        return relation[0]?.name ?? "Unknown";
    }
    return relation?.name ?? "Unknown";
};

const getOrCreateProfile = async (supabase, authUser: User): Promise<ProfileRow | null> => {
    const {data: profileRows, error: profileError} = await supabase
        .from("profiles")
        .select("id, name, email")
        .eq("auth_id", authUser.id)
        .limit(1);

    if (profileError) {
        console.error(profileError);
        return null;
    }

    let profileRow = profileRows?.[0] ?? null;

    if (!profileRow) {
        const {data: createdProfile, error: createError} = await supabase
            .from("profiles")
            .insert({
                auth_id: authUser.id,
                email: authUser.email ?? null,
                name: authUser.user_metadata?.full_name ?? null
            })
            .select("id, name, email")
            .single();

        if (createError) {
            console.error(createError);
            return null;
        }

        profileRow = createdProfile;
    } else if (!profileRow.email && authUser.email) {
        const {data: updatedProfile, error: updateError} = await supabase
            .from("profiles")
            .update({email: authUser.email})
            .eq("id", profileRow.id)
            .select("id, name, email")
            .single();

        if (!updateError && updatedProfile) {
            profileRow = updatedProfile;
        }
    }

    return profileRow;
};

async function addSkill(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return;

    const profile = await getOrCreateProfile(supabase, user);
    if (!profile) return;

    const skillId = Number(formData.get("skillId"));
    const skillLevel = String(formData.get("skillLevel") || levelOptions[0]);
    if (!skillId) return;

    await supabase.from("profile_skills").insert({
        profile_id: profile.id,
        skill_id: skillId,
        skill_level: skillLevel
    });
    revalidatePath("/dashboard/profile");
}

async function addLanguage(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return;

    const profile = await getOrCreateProfile(supabase, user);
    if (!profile) return;

    const languageId = Number(formData.get("languageId"));
    if (!languageId) return;

    await supabase.from("profile_languages").insert({
        profile_id: profile.id,
        language_id: languageId
    });
    revalidatePath("/dashboard/profile");
}

async function addCertificate(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const {data: {user}} = await supabase.auth.getUser();
    if (!user) return;

    const profile = await getOrCreateProfile(supabase, user);
    if (!profile) return;

    const certificateId = Number(formData.get("certificateId"));
    if (!certificateId) return;

    await supabase.from("profile_certificates").insert({
        profile_id: profile.id,
        certificate_id: certificateId
    });
    revalidatePath("/dashboard/profile");
}

async function removeSkill(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const rowId = Number(formData.get("rowId"));
    if (!rowId) return;
    await supabase.from("profile_skills").delete().eq("id", rowId);
    revalidatePath("/dashboard/profile");
}

async function removeLanguage(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const rowId = Number(formData.get("rowId"));
    if (!rowId) return;
    await supabase.from("profile_languages").delete().eq("id", rowId);
    revalidatePath("/dashboard/profile");
}

async function removeCertificate(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const rowId = Number(formData.get("rowId"));
    if (!rowId) return;
    await supabase.from("profile_certificates").delete().eq("id", rowId);
    revalidatePath("/dashboard/profile");
}

export default async function ProfilePage() {
    const supabase = await createClient();
    const {data: {user}, error: userError} = await supabase.auth.getUser();

    if (userError) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <h2 className="text-2xl font-semibold">Min profil</h2>
                <p className="mt-3 text-red-600">{userError.message}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <h2 className="text-2xl font-semibold">Min profil</h2>
                <p className="mt-3 text-gray-600">Please sign in to view your profile.</p>
            </div>
        );
    }

    const profile = await getOrCreateProfile(supabase, user);
    if (!profile) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <h2 className="text-2xl font-semibold">Min profil</h2>
                <p className="mt-3 text-red-600">Could not load profile.</p>
            </div>
        );
    }

    const [
        {data: skillsData, error: skillsError},
        {data: languagesData, error: languagesError},
        {data: certificatesData, error: certificatesError}
    ] = await Promise.all([
        supabase.from("skills").select("id, name").order("name", {ascending: true}),
        supabase.from("languages").select("id, name").order("name", {ascending: true}),
        supabase.from("certificates").select("id, name").order("name", {ascending: true})
    ]);

    if (skillsError || languagesError || certificatesError) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <h2 className="text-2xl font-semibold">Min profil</h2>
                <p className="mt-3 text-red-600">
                    {skillsError?.message || languagesError?.message || certificatesError?.message}
                </p>
            </div>
        );
    }

    const [
        {data: skillRows, error: skillError},
        {data: languageRows, error: languageError},
        {data: certificateRows, error: certificateError}
    ] = await Promise.all([
        supabase
            .from("profile_skills")
            .select("id, skill_id, skill_level, skills (id, name)")
            .eq("profile_id", profile.id)
            .order("id", {ascending: true}),
        supabase
            .from("profile_languages")
            .select("id, language_id, languages (id, name)")
            .eq("profile_id", profile.id)
            .order("id", {ascending: true}),
        supabase
            .from("profile_certificates")
            .select("id, certificate_id, certificates (id, name)")
            .eq("profile_id", profile.id)
            .order("id", {ascending: true})
    ]);

    if (skillError || languageError || certificateError) {
        return (
            <div className="mx-auto max-w-4xl p-6">
                <h2 className="text-2xl font-semibold">Min profil</h2>
                <p className="mt-3 text-red-600">
                    {skillError?.message || languageError?.message || certificateError?.message}
                </p>
            </div>
        );
    }

    const skills: SkillRow[] = (skillRows ?? []).map(row => ({
        id: row.id,
        skill_id: row.skill_id,
        name: resolveName(row.skills),
        level: row.skill_level
    }));
    const languages: LanguageRow[] = (languageRows ?? []).map(row => ({
        id: row.id,
        language_id: row.language_id,
        name: resolveName(row.languages)
    }));
    const certificates: CertificateRow[] = (certificateRows ?? []).map(row => ({
        id: row.id,
        certificate_id: row.certificate_id,
        name: resolveName(row.certificates)
    }));

    const skillOptions: BaseOption[] = skillsData ?? [];
    const languageOptions: BaseOption[] = languagesData ?? [];
    const certificateOptions: BaseOption[] = certificatesData ?? [];

    return (
        <div className="mx-auto max-w-4xl p-6">
            <h2 className="text-2xl font-semibold">Min profil</h2>
            <p className="mt-2 text-gray-600">
                {profile.name || "Unnamed profile"}{profile.email ? ` · ${profile.email}` : ""}
            </p>

            <Section title="Kunskaper & Kompetenser">
                <form action={addSkill} className="flex flex-wrap gap-3">
                    <select name="skillId" className="rounded border border-gray-300 px-3 py-2">
                        <option value="">Välj kompetens</option>
                        {skillOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    <select name="skillLevel" className="rounded border border-gray-300 px-3 py-2">
                        {levelOptions.map(level => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500"
                    >
                        Lägg till
                    </button>
                </form>

                <p className="mt-4 font-semibold">Sparade kompetenser:</p>
                <ul className="mt-2 space-y-2">
                    {skills.length === 0 ? (
                        <li className="text-gray-400">— Inga sparade kompetenser —</li>
                    ) : (
                        skills.map(skill => (
                            <li key={skill.id}
                                className="flex items-center justify-between rounded bg-gray-100 px-3 py-2">
                                <span>{skill.name} – {skill.level}</span>
                                <form action={removeSkill}>
                                    <input type="hidden" name="rowId" value={skill.id}/>
                                    <button type="submit" className="text-red-500 hover:text-red-600">🗑</button>
                                </form>
                            </li>
                        ))
                    )}
                </ul>
            </Section>

            <Section title="Certifikat">
                <form action={addCertificate} className="flex flex-wrap gap-3">
                    <select name="certificateId" className="rounded border border-gray-300 px-3 py-2">
                        <option value="">Välj certifikat</option>
                        {certificateOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500"
                    >
                        Lägg till
                    </button>
                </form>

                <p className="mt-4 font-semibold">Sparade certifikat:</p>
                <ul className="mt-2 space-y-2">
                    {certificates.length === 0 ? (
                        <li className="text-gray-400">— Inga sparade certifikat —</li>
                    ) : (
                        certificates.map(certificate => (
                            <li key={certificate.id}
                                className="flex items-center justify-between rounded bg-gray-100 px-3 py-2">
                                <span>{certificate.name}</span>
                                <form action={removeCertificate}>
                                    <input type="hidden" name="rowId" value={certificate.id}/>
                                    <button type="submit" className="text-red-500 hover:text-red-600">🗑</button>
                                </form>
                            </li>
                        ))
                    )}
                </ul>
            </Section>

            <Section title="Språk">
                <form action={addLanguage} className="flex flex-wrap gap-3">
                    <select name="languageId" className="rounded border border-gray-300 px-3 py-2">
                        <option value="">Välj språk</option>
                        {languageOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500"
                    >
                        Lägg till
                    </button>
                </form>

                <p className="mt-4 font-semibold">Sparade språk:</p>
                <ul className="mt-2 space-y-2">
                    {languages.length === 0 ? (
                        <li className="text-gray-400">— Inga sparade språk —</li>
                    ) : (
                        languages.map(language => (
                            <li key={language.id}
                                className="flex items-center justify-between rounded bg-gray-100 px-3 py-2">
                                <span>{language.name}</span>
                                <form action={removeLanguage}>
                                    <input type="hidden" name="rowId" value={language.id}/>
                                    <button type="submit" className="text-red-500 hover:text-red-600">🗑</button>
                                </form>
                            </li>
                        ))
                    )}
                </ul>
            </Section>
        </div>
    );
}

function Section({title, children}: { title: string; children: ReactNode }) {
    return (
        <section className="mt-6 rounded border border-gray-200 p-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="mt-3">{children}</div>
        </section>
    );
}
