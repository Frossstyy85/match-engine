"use client";

import type {CSSProperties} from "react";
import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase/client";
import {useAuth} from "@/app/dashboard/AuthProvider";
import type {User} from "@supabase/auth-js";

const levelOptions = ["basic", "intermediate", "advanced"];

const inputContainerStyle: CSSProperties = {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
    flexWrap: "wrap"
};

const listStyle: CSSProperties = {listStyle: "none", padding: 0, margin: 0};
const pageStyle: CSSProperties = {maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif"};
const dropdownStyle: CSSProperties = {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    minWidth: "150px"
};
const buttonStyle: CSSProperties = {
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "all 0.3s"
};
const savedItemStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    padding: "6px 10px",
    borderRadius: "6px",
    marginBottom: "6px",
    transition: "background 0.3s"
};
const emptyItemStyle: CSSProperties = {color: "#9CA3AF", padding: "6px 0"};
const removeButtonStyle: CSSProperties = {
    background: "transparent",
    border: "none",
    color: "#EF4444",
    cursor: "pointer",
    fontSize: "16px"
};

const sectionStyle: CSSProperties = {
    marginBottom: "20px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px"
};
const sectionHeaderStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const sectionContentStyle: CSSProperties = {marginTop: "10px"};

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

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [authChecked, setAuthChecked] = useState(false);

    const [profile, setProfile] = useState<ProfileRow | null>(null);

    const [skillOptions, setSkillOptions] = useState<BaseOption[]>([]);
    const [languageOptions, setLanguageOptions] = useState<BaseOption[]>([]);
    const [certificateOptions, setCertificateOptions] = useState<BaseOption[]>([]);

    const [skills, setSkills] = useState<SkillRow[]>([]);
    const [languages, setLanguages] = useState<LanguageRow[]>([]);
    const [certificates, setCertificates] = useState<CertificateRow[]>([]);

    const [selectedSkillId, setSelectedSkillId] = useState("");
    const [selectedSkillLevel, setSelectedSkillLevel] = useState(levelOptions[0]);
    const [selectedLanguageId, setSelectedLanguageId] = useState("");
    const [selectedCertificateId, setSelectedCertificateId] = useState("");

    const [actionLoading, setActionLoading] = useState({
        skills: false,
        languages: false,
        certificates: false
    });

    const setSectionLoading = (key, value) => {
        setActionLoading(prev => ({...prev, [key]: value}));
    };


    const {user} = useAuth();

    useEffect(() => {
        setAuthChecked(true);
    }, [user]);

    useEffect(() => {
        if (!authChecked) return;
        if (!user) {
            setError("Please sign in to view your profile.");
            setLoading(false);
            return;
        }

        void initializeProfile(user);
    }, [authChecked, user]);

    const initializeProfile = async (authUser: User) => {
        setLoading(true);
        setError("");

        const profileRow = await getOrCreateProfile(authUser);
        if (!profileRow) {
            setLoading(false);
            return;
        }

        setProfile(profileRow);
        await Promise.all([loadBaseOptions(), loadProfileData(profileRow.id)]);
        setLoading(false);
    };


    const getOrCreateProfile = async (authUser: User): Promise<ProfileRow | null> => {
        const {data: profileRows, error: profileError} = await supabase
            .from("profiles")
            .select("id, name, email")
            .eq("auth_id", authUser.id)
            .limit(1);

        if (profileError) {
            setError(profileError.message);
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
                setError(createError.message);
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

    const loadBaseOptions = async () => {
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
            setError(skillsError?.message || languagesError?.message || certificatesError?.message);
            return;
        }

        setSkillOptions(skillsData ?? []);
        setLanguageOptions(languagesData ?? []);
        setCertificateOptions(certificatesData ?? []);
    };

    const loadProfileData = async (profileId: string) => {
        const [
            {data: skillRows, error: skillError},
            {data: languageRows, error: languageError},
            {data: certificateRows, error: certificateError}
        ] = await Promise.all([
            supabase
                .from("profile_skills")
                .select("id, skill_id, skill_level, skills (id, name)")
                .eq("profile_id", profileId)
                .order("id", {ascending: true}),
            supabase
                .from("profile_languages")
                .select("id, language_id, languages (id, name)")
                .eq("profile_id", profileId)
                .order("id", {ascending: true}),
            supabase
                .from("profile_certificates")
                .select("id, certificate_id, certificates (id, name)")
                .eq("profile_id", profileId)
                .order("id", {ascending: true})
        ]);

        if (skillError || languageError || certificateError) {
            setError(skillError?.message || languageError?.message || certificateError?.message);
            return;
        }

        setSkills(
            (skillRows ?? []).map(row => ({
                id: row.id,
                skill_id: row.skill_id,
                name: resolveName(row.skills),
                level: row.skill_level
            }))
        );
        setLanguages(
            (languageRows ?? []).map(row => ({
                id: row.id,
                language_id: row.language_id,
                name: resolveName(row.languages)
            }))
        );
        setCertificates(
            (certificateRows ?? []).map(row => ({
                id: row.id,
                certificate_id: row.certificate_id,
                name: resolveName(row.certificates)
            }))
        );
    };

    const handleAddSkill = async () => {
        setError("");
        if (!profile?.id) return;

        const skillId = Number(selectedSkillId);
        if (!skillId) {
            setError("Select a skill.");
            return;
        }

        if (skills.some(skill => skill.skill_id === skillId)) {
            setError("Skill already added.");
            return;
        }

        setSectionLoading("skills", true);
        const {error: insertError} = await supabase.from("profile_skills").insert({
            profile_id: profile.id,
            skill_id: skillId,
            skill_level: selectedSkillLevel
        });

        if (insertError) {
            setError(insertError.message);
        } else {
            setSelectedSkillId("");
            setSelectedSkillLevel(levelOptions[0]);
            await loadProfileData(profile.id);
        }
        setSectionLoading("skills", false);
    };

    const handleAddLanguage = async () => {
        setError("");
        if (!profile?.id) return;

        const languageId = Number(selectedLanguageId);
        if (!languageId) {
            setError("Select a language.");
            return;
        }

        if (languages.some(language => language.language_id === languageId)) {
            setError("Language already added.");
            return;
        }

        setSectionLoading("languages", true);
        const {error: insertError} = await supabase.from("profile_languages").insert({
            profile_id: profile.id,
            language_id: languageId
        });

        if (insertError) {
            setError(insertError.message);
        } else {
            setSelectedLanguageId("");
            await loadProfileData(profile.id);
        }
        setSectionLoading("languages", false);
    };

    const handleAddCertificate = async () => {
        setError("");
        if (!profile?.id) return;

        const certificateId = Number(selectedCertificateId);
        if (!certificateId) {
            setError("Select a certificate.");
            return;
        }

        if (certificates.some(certificate => certificate.certificate_id === certificateId)) {
            setError("Certificate already added.");
            return;
        }

        setSectionLoading("certificates", true);
        const {error: insertError} = await supabase.from("profile_certificates").insert({
            profile_id: profile.id,
            certificate_id: certificateId
        });

        if (insertError) {
            setError(insertError.message);
        } else {
            setSelectedCertificateId("");
            await loadProfileData(profile.id);
        }
        setSectionLoading("certificates", false);
    };

    const handleRemoveSkill = async (rowId) => {
        setError("");
        if (!profile?.id) return;
        setSectionLoading("skills", true);
        const {error: deleteError} = await supabase.from("profile_skills").delete().eq("id", rowId);
        if (deleteError) {
            setError(deleteError.message);
        } else {
            await loadProfileData(profile.id);
        }
        setSectionLoading("skills", false);
    };

    const handleRemoveLanguage = async (rowId) => {
        setError("");
        if (!profile?.id) return;
        setSectionLoading("languages", true);
        const {error: deleteError} = await supabase.from("profile_languages").delete().eq("id", rowId);
        if (deleteError) {
            setError(deleteError.message);
        } else {
            await loadProfileData(profile.id);
        }
        setSectionLoading("languages", false);
    };

    const handleRemoveCertificate = async (rowId) => {
        setError("");
        if (!profile?.id) return;
        setSectionLoading("certificates", true);
        const {error: deleteError} = await supabase.from("profile_certificates").delete().eq("id", rowId);
        if (deleteError) {
            setError(deleteError.message);
        } else {
            await loadProfileData(profile.id);
        }
        setSectionLoading("certificates", false);
    };

    if (loading) {
        return <div style={pageStyle}>Loading profile...</div>;
    }

    if (error) {
        return (
            <div style={pageStyle}>
                <h2 style={{marginBottom: "10px"}}>Min profil</h2>
                <p style={{color: "#DC2626"}}>{error}</p>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <h2 style={{marginBottom: "10px"}}>Min profil</h2>
            <p style={{marginBottom: "20px", color: "#6B7280"}}>
                {profile?.name || "Unnamed profile"}{profile?.email ? ` · ${profile.email}` : ""}
            </p>

            <Section title="Kunskaper & Kompetenser">
                <div style={inputContainerStyle}>
                    <select
                        value={selectedSkillId}
                        onChange={(e) => setSelectedSkillId(e.target.value)}
                        style={dropdownStyle}
                        disabled={actionLoading.skills}
                    >
                        <option value="">Välj kompetens</option>
                        {skillOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={selectedSkillLevel}
                        onChange={(e) => setSelectedSkillLevel(e.target.value)}
                        style={dropdownStyle}
                        disabled={actionLoading.skills}
                    >
                        {levelOptions.map(level => (
                            <option key={level} value={level}>
                                {level}
                            </option>
                        ))}
                    </select>

                    <button style={buttonStyle} onClick={handleAddSkill} disabled={actionLoading.skills}>
                        Lägg till
                    </button>
                </div>

                <p><strong>Sparade kompetenser:</strong></p>
                <ul style={listStyle}>
                    {skills.length === 0 ? (
                        <li style={emptyItemStyle}>— Inga sparade kompetenser —</li>
                    ) : (
                        skills.map(skill => (
                            <li key={skill.id} style={savedItemStyle}>
                                <span>{skill.name} – {skill.level}</span>
                                <button
                                    style={removeButtonStyle}
                                    onClick={() => handleRemoveSkill(skill.id)}
                                    disabled={actionLoading.skills}
                                >
                                    🗑
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </Section>

            <Section title="Certifikat">
                <div style={inputContainerStyle}>
                    <select
                        value={selectedCertificateId}
                        onChange={(e) => setSelectedCertificateId(e.target.value)}
                        style={dropdownStyle}
                        disabled={actionLoading.certificates}
                    >
                        <option value="">Välj certifikat</option>
                        {certificateOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>

                    <button
                        style={buttonStyle}
                        onClick={handleAddCertificate}
                        disabled={actionLoading.certificates}
                    >
                        Lägg till
                    </button>
                </div>

                <p><strong>Sparade certifikat:</strong></p>
                <ul style={listStyle}>
                    {certificates.length === 0 ? (
                        <li style={emptyItemStyle}>— Inga sparade certifikat —</li>
                    ) : (
                        certificates.map(certificate => (
                            <li key={certificate.id} style={savedItemStyle}>
                                <span>{certificate.name}</span>
                                <button
                                    style={removeButtonStyle}
                                    onClick={() => handleRemoveCertificate(certificate.id)}
                                    disabled={actionLoading.certificates}
                                >
                                    🗑
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </Section>

            <Section title="Språk">
                <div style={inputContainerStyle}>
                    <select
                        value={selectedLanguageId}
                        onChange={(e) => setSelectedLanguageId(e.target.value)}
                        style={dropdownStyle}
                        disabled={actionLoading.languages}
                    >
                        <option value="">Välj språk</option>
                        {languageOptions.map(option => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>

                    <button
                        style={buttonStyle}
                        onClick={handleAddLanguage}
                        disabled={actionLoading.languages}
                    >
                        Lägg till
                    </button>
                </div>

                <p><strong>Sparade språk:</strong></p>
                <ul style={listStyle}>
                    {languages.length === 0 ? (
                        <li style={emptyItemStyle}>— Inga sparade språk —</li>
                    ) : (
                        languages.map(language => (
                            <li key={language.id} style={savedItemStyle}>
                                <span>{language.name}</span>
                                <button
                                    style={removeButtonStyle}
                                    onClick={() => handleRemoveLanguage(language.id)}
                                    disabled={actionLoading.languages}
                                >
                                    🗑
                                </button>
                            </li>
                        ))
                    )}
                </ul>
            </Section>
        </div>
    );
}

function Section({title, children}) {
    return (
        <section style={sectionStyle}>
            <div style={sectionHeaderStyle}>
                <h3>{title}</h3>
            </div>
            <div style={sectionContentStyle}>{children}</div>
        </section>
    );
}
