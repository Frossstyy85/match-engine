import Link from "next/link";
import {fetchProject} from "@/lib/db/projects";
import {fetchSkillsWithCategories} from "@/lib/db/skills";
import EditProjectForm from "@/app/dashboard/projects/[id]/edit/edit-project-form";


type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    const [project, skills] = await Promise.all(
        [
            fetchProject(Number(id)),
            fetchSkillsWithCategories(),
        ]
    )

    return (
        <div className="w-full min-w-0 p-3 sm:p-4">
            <div className="flex flex-col gap-4 w-full max-w-xl min-w-0 overflow-auto border border-gray-200 bg-white shadow-sm rounded-lg p-4 sm:p-6">
                <Link
                    href={`/dashboard/projects/${id}`}
                    className={"text-sm text-blue-600 hover:underline"}
                >
                    Back to projects
                </Link>
                <EditProjectForm
                    project={project}
                    skills={skills}
                    projectSkills={project.projectSkills}
                    teams={Array.isArray(project.teams) ? project.teams : []}
                />
            </div>
        </div>
    )

}