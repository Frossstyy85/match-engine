import "@/components/table/table.css";
import { createClient } from "@/lib/supabase/server";
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";
import Link from "next/link";
import {notFound} from "next/navigation";

export default async function Page({ params }){

    const { id } = await params;

    const supabase = await createClient();

    const { data: project } = await supabase
        .from("projects")
        .select("*, teams(id, name)")
        .eq("id", id)
        .single();


    if (!project) notFound()



    const teams: any[] = project.teams;
    const teamsNode = teams.length !== 0 ? teams.map((team) => (
            <div key={team.id}>
                <Link href={`/dashboard/teams/${team.id}`}
                      className={"text-sm text-blue-600 hover:underline"}
                >
                    {team.name}
                </Link>
            </div>
        )) : <p>No teams found</p>


    return (
        <div className={"w-full h-screen flex justify-center bg-gray-50"}>
            <div
                className={
                    "flex flex-col gap-4 w-full max-w-4/5 h-fit mt-5 mb-5 overflow-auto border-gray-200 border bg-white shadow-sm radius rounded p-6"
                }
            >
                <div className={"flex items-center justify-between w-full"}>
                    <div>
                        <h1 className={"text-2xl font-semibold"}>{project.name}</h1>
                        <p className={"text-sm text-gray-500"}>
                            ID: {project.id}
                        </p>
                    </div>
                    <div className={"space-x-8"}>
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

                        <Field>
                            <FieldTitle>Created</FieldTitle>
                            <div>
                                {project.created_at
                                    ? new Date(project.created_at).toLocaleDateString("sv-SE")
                                    : "—"}
                            </div>
                        </Field>
                        <Field>
                            <FieldTitle>Teams</FieldTitle>
                            {teamsNode}
                        </Field>
                    </FieldGroup>
                </div>
            </div>
        </div>
    );
}