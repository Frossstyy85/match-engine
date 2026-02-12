import "@/components/table/table.css";
import { createClient } from "@/lib/supabase/server";
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";
import Link from "next/link";
import {notFound} from "next/navigation";

export default async function Page({ params }){

    const { id } = await params;

    const supabase = await createClient();

    const { data: team } = await supabase
        .from("teams")
        .select()
        .eq("id", id)
        .single();


    if (!team) notFound()

    return (
        <div className={"w-full h-screen flex justify-center bg-gray-50"}>
            <div
                className={
                    "flex flex-col gap-4 w-full max-w-4/5 h-fit mt-5 mb-5 overflow-auto border-gray-200 border bg-white shadow-sm radius rounded p-6"
                }
            >
                <div className={"flex items-center justify-between w-full"}>
                    <div>
                        <div className={"flex space-x-6"}>
                            <h1 className={"text-2xl font-semibold"}>{team.name}</h1>
                            <Link
                                href={`/dashboard/teams/${team.id}/edit`}
                                className={"text-sm text-blue-600 hover:underline"}
                            >
                                Edit team
                            </Link>
                            <Link
                                href={`/dashboard/projects/${team.project_id}`}
                            className={"text-sm text-blue-600 hover:underline"}
                            >
                                View project
                            </Link>
                            <Link
                                href="/dashboard/teams"
                                className={"text-sm text-blue-600 hover:underline"}
                            >
                                Back to teams
                            </Link>
                        </div>



                        <p className={"text-sm text-gray-500"}>
                            ID: {team.id}
                        </p>
                    </div>
                </div>

                <div className={"border-t border-gray-200 pt-4"}>
                    <FieldGroup>
                        <Field>
                            <FieldTitle>Team name</FieldTitle>
                            <div>{team.name}</div>
                        </Field>
                    </FieldGroup>
                </div>
            </div>
        </div>
    );
}