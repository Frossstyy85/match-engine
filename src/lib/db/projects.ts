"use server";

import { createClient } from "@/lib/supabase/server";

function normalizeId(value: unknown) {
	if (typeof value === "string" && /^\d+$/.test(value)) {
		const parsed = Number(value);
		if (Number.isSafeInteger(parsed)) return parsed;
	}

	return value;
}

function mapProjectRow(row: any) {
	return {
		id: row.id,
		name: row.name,
		description: row.description ?? null,
		startDate: row.start_date ? new Date(row.start_date) : null,
		endDate: row.end_date ? new Date(row.end_date) : null,
		status: row.status ?? null,
	};
}

export async function getProjects({
	page,
	pageSize,
	query,
}: {
	page: number;
	pageSize: number;
	query?: string;
}) {
	const from = (page - 1) * pageSize;
	const to = from + pageSize - 1;

	const supabase = await createClient();
	let queryBuilder = supabase
		.from("projects")
		.select("id, name, description, start_date, end_date, status", {
			count: "exact",
		})
		.range(from, to)
		.order("created_at", { ascending: true });

	if (query) {
		queryBuilder = queryBuilder.ilike("name", `%${query}%`);
	}

	const { data, error, count } = await queryBuilder;
	if (error) throw error;

	const totalRows = count ?? 0;
	const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

	return {
		rows: (data ?? []).map(mapProjectRow),
		totalPages,
	};
}

export async function getProjectById(projectId: unknown) {
	const normalizedProjectId = normalizeId(projectId);
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("projects")
		.select(
			"*, project_skills(skills(id, name)), project_languages(languages(id, name)), project_certificates(certificates(id, name)), teams(id, name, project_id)",
		)
		.eq("id", normalizedProjectId)
		.maybeSingle();

	if (error) throw error;
	if (!data) return null;

	const projectSkills = (data.project_skills ?? [])
		.map((projectSkill: any) => projectSkill.skills?.name ?? null)
		.filter(Boolean);

	const projectLanguages = (data.project_languages ?? [])
		.map((projectLanguage: any) => projectLanguage.languages?.name ?? null)
		.filter(Boolean);

	const projectCertificates = (data.project_certificates ?? [])
		.map(
			(projectCertificate: any) =>
				projectCertificate.certificates?.name ?? null,
		)
		.filter(Boolean);

	const teams = (data.teams ?? []).map((team: any) => ({
		id: team.id,
		name: team.name ?? "",
		projectId: team.project_id ?? null,
	}));

	return {
		...mapProjectRow(data),
		projectSkills,
		projectLanguages,
		projectCertificates,
		teams,
	};
}

export async function getProjectLanguagesOptions() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("languages")
		.select("id, name")
		.order("name", { ascending: true });
	if (error) throw error;

	return (data ?? []).filter((row) => row.id != null && row.name);
}

export async function getProjectCertificatesOptions() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("certificates")
		.select("id, name")
		.order("name", { ascending: true });
	if (error) throw error;

	return (data ?? []).filter((row) => row.id != null && row.name);
}

export async function createProject({
	name,
	description,
	startDate,
	endDate,
}: {
	name: string;
	description?: string | null;
	startDate?: string | null;
	endDate?: string | null;
}) {
	const projectName = name?.trim();
	if (!projectName) throw new Error("Project name is required");

	const supabase = await createClient();
	const { data, error } = await supabase
		.from("projects")
		.insert({
			name: projectName,
			description: description?.trim() || null,
			start_date: startDate || null,
			end_date: endDate || null,
		})
		.select("id")
		.single();

	if (error) throw error;
	return data?.id ?? null;
}

export async function updateProject(
	projectId: unknown,
	fields: any,
	skillNames: string[],
	languageNames: string[] = [],
	certificateNames: string[] = [],
) {
	const normalizedProjectId = normalizeId(projectId);
	const supabase = await createClient();

	const { error: projectError } = await supabase
		.from("projects")
		.update({
			name: fields.name,
			description: fields.description || null,
			start_date: fields.start_date || null,
			end_date: fields.end_date || null,
		})
		.eq("id", normalizedProjectId);

	if (projectError) throw projectError;

	const [deleteSkillsError, deleteLanguagesError, deleteCertificatesError] =
		await Promise.all([
			supabase
				.from("project_skills")
				.delete()
				.eq("project_id", normalizedProjectId),
			supabase
				.from("project_languages")
				.delete()
				.eq("project_id", normalizedProjectId),
			supabase
				.from("project_certificates")
				.delete()
				.eq("project_id", normalizedProjectId),
		]);

	if (deleteSkillsError.error) throw deleteSkillsError.error;
	if (deleteLanguagesError.error) throw deleteLanguagesError.error;
	if (deleteCertificatesError.error) throw deleteCertificatesError.error;

	if (skillNames.length > 0) {
		const { data: skillRows, error: skillsError } = await supabase
			.from("skills")
			.select("id")
			.in("name", skillNames);
		if (skillsError) throw skillsError;

		if (skillRows && skillRows.length > 0) {
			const { error: insertSkillsError } = await supabase
				.from("project_skills")
				.insert(
					skillRows.map((skill: any) => ({
						project_id: normalizedProjectId,
						skill_id: skill.id,
					})),
				);
			if (insertSkillsError) throw insertSkillsError;
		}
	}

	if (languageNames.length > 0) {
		const { data: languageRows, error: languagesError } = await supabase
			.from("languages")
			.select("id")
			.in("name", languageNames);
		if (languagesError) throw languagesError;

		if (languageRows && languageRows.length > 0) {
			const { error: insertLanguagesError } = await supabase
				.from("project_languages")
				.insert(
					languageRows.map((language: any) => ({
						project_id: normalizedProjectId,
						language_id: language.id,
					})),
				);
			if (insertLanguagesError) throw insertLanguagesError;
		}
	}

	if (certificateNames.length > 0) {
		const { data: certificateRows, error: certificatesError } = await supabase
			.from("certificates")
			.select("id")
			.in("name", certificateNames);
		if (certificatesError) throw certificatesError;

		if (certificateRows && certificateRows.length > 0) {
			const { error: insertCertificatesError } = await supabase
				.from("project_certificates")
				.insert(
					certificateRows.map((certificate: any) => ({
						project_id: normalizedProjectId,
						certificate_id: certificate.id,
					})),
				);
			if (insertCertificatesError) throw insertCertificatesError;
		}
	}
}

export async function deleteProject(projectId: unknown) {
	const normalizedProjectId = normalizeId(projectId);
	const supabase = await createClient();

	const { error: teamsError } = await supabase
		.from("teams")
		.delete()
		.eq("project_id", normalizedProjectId);
	if (teamsError) throw teamsError;

	const { error: projectError } = await supabase
		.from("projects")
		.delete()
		.eq("id", normalizedProjectId);
	if (projectError) throw projectError;
}

export async function getRecommendedUsers(projectId: unknown) {
	const normalizedProjectId = normalizeId(projectId);
	const supabase = await createClient();

	const { data, error } = await supabase.rpc(
		"get_recommended_users_for_project",
		{
			p_project_id: normalizedProjectId,
			p_limit: 5,
		},
	);

	if (error) throw error;

	return (data ?? []).map((row: any) => ({
		user_id: row.user_id,
		user_name: row.user_name ?? "Unnamed user",
		match_score_percent: Number(row.match_score_percent) ?? 0,
		matched_skills: Array.isArray(row.matched_skills) ? row.matched_skills : [],
		unmatched_skills: Array.isArray(row.unmatched_skills)
			? row.unmatched_skills
			: [],
		matched_count: Number(row.matched_count) ?? 0,
		unmatched_count: Number(row.unmatched_count) ?? 0,
	}));
}
