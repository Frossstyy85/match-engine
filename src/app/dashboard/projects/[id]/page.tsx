import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchProject } from "@/lib/db/projects";
import { formatDate } from "@/lib/helpers/date";
import type { Team } from "@/lib/types";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = await fetchProject(id);

    if (!project) notFound();

    const teams: Team[] = Array.isArray(project.teams) ? project.teams : [];
    const teamsNode = teams.length !== 0 ? teams.map((team) => (
            <div key={team.id}>
                <Link href={`/dashboard/teams/${team.id}`}
                      className={"text-sm text-blue-600 hover:underline"}
                >
                    {team.name}
                </Link>
            </div>
        )) : <p>No teams found</p>

    const skills = project.projectSkills;
    const skillsNode = skills.length !== 0 ? skills.map((skill, idx) => (
        <div key={idx}>
                {skill}
        </div>
    )) : <p>No skills found</p>


    return (
        <div className="w-full min-w-0 p-3 sm:p-4">
            <div className="flex flex-col gap-4 w-full min-w-0 overflow-auto border border-gray-200 bg-white shadow-sm rounded p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold">{project.name}</h1>
                        <p className="text-sm text-gray-500">
                            ID: {project.id}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:space-x-8">
                        <Link
                            href={`/dashboard/projects/${project.id}/edit`}
                            className={"text-sm text-blue-600 hover:underline"}
                            >
                            Edit project
                        </Link>
                        <Link
                            href="/dashboard/projects"
                            className={"text-sm text-blue-600 hover:underline"}
                        >
                            Back to projects
                        </Link>
                    </div>

                </div>

                <div className={"border-t border-gray-200 pt-4"}>
                    <FieldGroup>
                        <Field>
                            <FieldTitle>Project name</FieldTitle>
                            <div>{project.name}</div>
                        </Field>

                        <Field>
                            <FieldTitle>Project ID</FieldTitle>
                            <div>{project.id}</div>
                        </Field>
                        <FieldGroup>
                            <Field>
                                <FieldTitle>Start date</FieldTitle>
                                {formatDate(project.start_date)}
                            </Field>
                            <Field>
                                <FieldTitle>End date</FieldTitle>
                                {formatDate(project.end_date)}
                            </Field>
                        </FieldGroup>
                        <Field>
                            <FieldTitle>Teams</FieldTitle>
                            {teamsNode}
                        </Field>
                        <Field>
                            <FieldTitle>Required skills</FieldTitle>
                            {skillsNode}
                        </Field>
                    </FieldGroup>
                </div>
            </div>
        </div>
    );
}