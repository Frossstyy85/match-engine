import { notFound } from "next/navigation";
import ProfileCertificatesForm from "@/app/dashboard/profile/ProfileCertificatesForm";
import ProfileIdentityForm from "@/app/dashboard/profile/ProfileIdentityForm";
import ProfileLanguagesForm from "@/app/dashboard/profile/ProfileLanguagesForm";
import ProfileSkillsForm from "@/app/dashboard/profile/ProfileSkillsForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user?.id) notFound();

	const [profileRes, skillsRes, languagesRes, certificatesRes] =
		await Promise.all([
			supabase
				.from("profiles")
				.select("id, name, email")
				.eq("auth_id", user.id)
				.maybeSingle(),
			supabase
				.from("skills")
				.select("id, name")
				.order("name", { ascending: true }),
			supabase
				.from("languages")
				.select("id, name")
				.order("name", { ascending: true }),
			supabase
				.from("certificates")
				.select("id, name")
				.order("name", { ascending: true }),
		]);

	const profile = profileRes.data;
	if (!profile?.id) {
		return <p className="text-muted-foreground text-sm">Profile not found.</p>;
	}

	const [profileSkillsRes, profileLanguagesRes, profileCertificatesRes] =
		await Promise.all([
			supabase
				.from("profile_skills")
				.select("skills(name)")
				.eq("profile_id", profile.id),
			supabase
				.from("profile_languages")
				.select("languages(name)")
				.eq("profile_id", profile.id),
			supabase
				.from("profile_certificates")
				.select("certificates(name)")
				.eq("profile_id", profile.id),
		]);

	const skills = (skillsRes.data ?? []).filter(
		(row) => row.id != null && row.name,
	);
	const languages = (languagesRes.data ?? []).filter(
		(row) => row.id != null && row.name,
	);
	const certificates = (certificatesRes.data ?? []).filter(
		(row) => row.id != null && row.name,
	);

	const selectedSkills = (profileSkillsRes.data ?? [])
		.map((row) => row.skills?.name)
		.filter(Boolean);
	const selectedLanguages = (profileLanguagesRes.data ?? [])
		.map((row) => row.languages?.name)
		.filter(Boolean);
	const selectedCertificates = (profileCertificatesRes.data ?? [])
		.map((row) => row.certificates?.name)
		.filter(Boolean);

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Identity</CardTitle>
				</CardHeader>
				<CardContent>
					<ProfileIdentityForm
						id={user.id}
						name={profile.name ?? ""}
						email={profile.email ?? user.email ?? ""}
					/>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Skills</CardTitle>
				</CardHeader>
				<CardContent>
					<ProfileSkillsForm
						id={user.id}
						options={skills}
						initialSelected={selectedSkills}
					/>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Certificates</CardTitle>
				</CardHeader>
				<CardContent>
					<ProfileCertificatesForm
						id={user.id}
						options={certificates}
						initialSelected={selectedCertificates}
					/>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Languages</CardTitle>
				</CardHeader>
				<CardContent>
					<ProfileLanguagesForm
						id={user.id}
						options={languages}
						initialSelected={selectedLanguages}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
