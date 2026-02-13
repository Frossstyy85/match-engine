import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile, removeProfileSkill, removeProfileLanguage, removeProfileCertificate } from "@/lib/db/profile";
import type { ProfileSkillRow, ProfileLanguageRow, ProfileCertificateRow } from "@/lib/db/profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ProfileAddSkillForm, ProfileAddLanguageForm, ProfileAddCertificateForm } from "@/app/dashboard/profile/ProfileAddForms";

function resolveName(
    relation: { name?: string | null } | { name?: string | null }[] | null | undefined
): string {
    if (Array.isArray(relation)) return relation[0]?.name ?? "Unknown";
    return relation?.name ?? "Unknown";
}

type SkillOptionRow = { id: number; name: string | null };
type ProfileSkillRowDb = { id: number; skill_id: number; skill_level: string; skills: { name: string } | { name: string }[] | null };
type ProfileLanguageRowDb = { id: number; language_id: number; languages: { name: string } | { name: string }[] | null };
type ProfileCertificateRowDb = { id: number; certificate_id: number; certificates: { name: string } | { name: string }[] | null };

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError) {
        return (
            <div className="w-full min-w-0 p-4 sm:p-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <h2 className="text-lg font-semibold">Profile</h2>
                    <p className="mt-2 text-sm text-destructive">{userError.message}</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full min-w-0 p-4 sm:p-6">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="text-lg font-semibold">Profile</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Sign in to view your profile.</p>
                </div>
            </div>
        );
    }

    const profile = await getOrCreateProfile(supabase, user);
    if (!profile) {
        return (
            <div className="w-full min-w-0 p-4 sm:p-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <h2 className="text-lg font-semibold">Profile</h2>
                    <p className="mt-2 text-sm text-destructive">Could not load profile.</p>
                </div>
            </div>
        );
    }

    const [
        { data: skillsData, error: skillsError },
        { data: languagesData, error: languagesError },
        { data: certificatesData, error: certificatesError },
        { data: skillRows, error: skillError },
        { data: languageRows, error: languageError },
        { data: certificateRows, error: certificateError },
    ] = await Promise.all([
        supabase.from("skills").select("id, name").order("name", { ascending: true }),
        supabase.from("languages").select("id, name").order("name", { ascending: true }),
        supabase.from("certificates").select("id, name").order("name", { ascending: true }),
        supabase
            .from("profile_skills")
            .select("id, skill_id, skill_level, skills (id, name)")
            .eq("profile_id", profile.id)
            .order("id", { ascending: true }),
        supabase
            .from("profile_languages")
            .select("id, language_id, languages (id, name)")
            .eq("profile_id", profile.id)
            .order("id", { ascending: true }),
        supabase
            .from("profile_certificates")
            .select("id, certificate_id, certificates (id, name)")
            .eq("profile_id", profile.id)
            .order("id", { ascending: true }),
    ]);

    if (skillsError || languagesError || certificatesError || skillError || languageError || certificateError) {
        const msg = skillsError?.message ?? languagesError?.message ?? certificatesError?.message
            ?? skillError?.message ?? languageError?.message ?? certificateError?.message;
        return (
            <div className="w-full min-w-0 p-4 sm:p-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <h2 className="text-lg font-semibold">Profile</h2>
                    <p className="mt-2 text-sm text-destructive">{msg}</p>
                </div>
            </div>
        );
    }

    const skills: ProfileSkillRow[] = (skillRows ?? []).map((row: ProfileSkillRowDb) => ({
        id: row.id,
        skill_id: row.skill_id,
        name: resolveName(row.skills),
        level: row.skill_level,
    }));
    const languages: ProfileLanguageRow[] = (languageRows ?? []).map((row: ProfileLanguageRowDb) => ({
        id: row.id,
        language_id: row.language_id,
        name: resolveName(row.languages),
    }));
    const certificates: ProfileCertificateRow[] = (certificateRows ?? []).map((row: ProfileCertificateRowDb) => ({
        id: row.id,
        certificate_id: row.certificate_id,
        name: resolveName(row.certificates),
    }));

    const skillOptions = (skillsData ?? []).map((r: SkillOptionRow) => ({ id: r.id, name: r.name }));
    const languageOptions = (languagesData ?? []).map((r: SkillOptionRow) => ({ id: r.id, name: r.name }));
    const certificateOptions = (certificatesData ?? []).map((r: SkillOptionRow) => ({ id: r.id, name: r.name }));

    return (
        <div className="w-full min-w-0 p-4 sm:p-6">
            <div className="flex flex-col gap-6">
                <div className="rounded-lg border bg-card px-4 py-5 shadow-sm sm:px-6">
                    <h2 className="text-xl font-semibold sm:text-2xl">Profile</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {profile.name || "Unnamed"}{profile.email ? ` · ${profile.email}` : ""}
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 px-4 sm:px-6">
                        <ProfileAddSkillForm options={skillOptions} />
                        <div>
                            <p className="mb-2 text-sm font-medium text-muted-foreground">Your skills</p>
                            {skills.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No skills added yet.</p>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {skills.map((skill) => (
                                        <li
                                            key={skill.id}
                                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2.5 text-sm"
                                        >
                                            <span className="font-medium">{skill.name}</span>
                                            <span className="text-muted-foreground">— {skill.level}</span>
                                            <form action={removeProfileSkill} className="ml-auto sm:ml-0">
                                                <input type="hidden" name="rowId" value={skill.id} />
                                                <Button type="submit" variant="ghost" size="icon-xs" aria-label="Remove">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </form>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 px-4 sm:px-6">
                        <ProfileAddLanguageForm options={languageOptions} />
                        <div>
                            <p className="mb-2 text-sm font-medium text-muted-foreground">Your languages</p>
                            {languages.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No languages added yet.</p>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {languages.map((lang) => (
                                        <li
                                            key={lang.id}
                                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2.5 text-sm"
                                        >
                                            <span className="font-medium">{lang.name}</span>
                                            <form action={removeProfileLanguage} className="ml-auto sm:ml-0">
                                                <input type="hidden" name="rowId" value={lang.id} />
                                                <Button type="submit" variant="ghost" size="icon-xs" aria-label="Remove">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </form>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Certificates</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 px-4 sm:px-6">
                        <ProfileAddCertificateForm options={certificateOptions} />
                        <div>
                            <p className="mb-2 text-sm font-medium text-muted-foreground">Your certificates</p>
                            {certificates.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No certificates added yet.</p>
                            ) : (
                                <ul className="flex flex-col gap-2">
                                    {certificates.map((cert) => (
                                        <li
                                            key={cert.id}
                                            className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-muted/30 px-3 py-2.5 text-sm"
                                        >
                                            <span className="font-medium">{cert.name}</span>
                                            <form action={removeProfileCertificate} className="ml-auto sm:ml-0">
                                                <input type="hidden" name="rowId" value={cert.id} />
                                                <Button type="submit" variant="ghost" size="icon-xs" aria-label="Remove">
                                                    <Trash2 className="size-4" />
                                                </Button>
                                            </form>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
