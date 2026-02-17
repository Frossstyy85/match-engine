import { createClient } from "@/lib/supabase/server";
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteTeamButton } from "@/components/DeleteTeamButton";

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    const supabase = await createClient();

    const { data: team, error } = await supabase
        .from("teams")
        .select()
        .eq("id", id)
        .single();

    if (error) {
        return (
            <div className="w-full min-w-0 p-3 sm:p-4">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <p className="text-sm text-destructive">{error.message}</p>
                </div>
            </div>
        );
    }
    if (!team) notFound();

    const { data: members } = await supabase
        .from("profiles")
        .select("id, name, email, team_id")
        .eq("team_id", team.id);

    return (
        <div className="w-full min-w-0 p-3 sm:p-4">
            <div className="flex flex-col gap-4 w-full min-w-0 overflow-auto border border-gray-200 bg-white shadow-sm rounded-lg p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:items-start w-full">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-6">
                            <h1 className="text-xl sm:text-2xl font-semibold">{team.name}</h1>
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
                            <DeleteTeamButton teamId={team.id} teamName={team.name} />
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
                        <Field>
                            <FieldTitle>Team members</FieldTitle>
                            <div className="space-y-1 text-sm">
                                {members && members.length > 0 ? (
                                    members.map((member: any) => (
                                        <div key={member.id}>
                                            {member.name ?? member.email ?? "Unnamed member"}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-400">No members in this team.</div>
                                )}
                            </div>
                        </Field>
                    </FieldGroup>
                </div>
            </div>
        </div>
    );
}