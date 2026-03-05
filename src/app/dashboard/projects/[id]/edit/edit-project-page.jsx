"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeftIcon, Edit3Icon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import EditProjectForm from "@/app/dashboard/projects/components/edit-project-form";
import {
	getProjectCertificatesOptions as fetchCertificateOptions,
	getProjectLanguagesOptions as fetchLanguageOptions,
	getProjectById as fetchProject,
} from "@/lib/db/projects";
import { getSkillsWithCategory as fetchSkillsWithCategories } from "@/lib/db/skills";

export default function EditProjectPage({ projectId }) {
	const projectQuery = useQuery({
		queryKey: ["project", projectId],
		queryFn: () => fetchProject(projectId),
	});

	const skillsQuery = useQuery({
		queryKey: ["skills-with-categories"],
		queryFn: fetchSkillsWithCategories,
	});

	const languagesQuery = useQuery({
		queryKey: ["project-language-options"],
		queryFn: fetchLanguageOptions,
	});

	const certificatesQuery = useQuery({
		queryKey: ["project-certificate-options"],
		queryFn: fetchCertificateOptions,
	});

	if (
		projectQuery.isLoading ||
		skillsQuery.isLoading ||
		languagesQuery.isLoading ||
		certificatesQuery.isLoading
	) {
		return <p className="text-muted-foreground text-sm">Loading project...</p>;
	}

	if (
		projectQuery.error ||
		skillsQuery.error ||
		languagesQuery.error ||
		certificatesQuery.error ||
		!projectQuery.data
	) {
		return <p className="text-destructive text-sm">Failed to load project.</p>;
	}

	const project = projectQuery.data;
	const skills = skillsQuery.data ?? [];
	const languages = languagesQuery.data ?? [];
	const certificates = certificatesQuery.data ?? [];

	return (
		<div className="w-full min-w-0 p-3 sm:p-4">
			<div className="mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-3">
				<header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
					<div className="min-w-0 space-y-1">
						<h1 className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
							<Edit3Icon className="text-muted-foreground size-4.5" />
							<span className="truncate">Edit project</span>
						</h1>
						<p className="text-muted-foreground text-sm">{project.name}</p>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Button asChild size="sm" variant="ghost">
							<Link href={`/dashboard/projects/${projectId}`}>
								<ArrowLeftIcon />
								Back
							</Link>
						</Button>
					</div>
				</header>

				<Card className="w-full max-w-4xl border-border shadow-sm">
					<CardContent className="space-y-3 p-5">
						<EditProjectForm
							project={project}
							skills={skills}
							projectSkills={project.projectSkills}
							languages={languages}
							certificates={certificates}
							projectLanguages={project.projectLanguages}
							projectCertificates={project.projectCertificates}
							teams={project.teams}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
