import Link from "next/link";
import EditTeamForm from "@/app/dashboard/teams/[id]/edit/edit-team-form";
import { createClient } from "@/lib/supabase/server";

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    const supabase = await createClient();

    const { data: team } = await supabase
        .from("teams")
        .select("id, name, project_id")
        .eq("id", id)
        .single();

    const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, email, team_id");

    return (
        <div className="w-full min-w-0 p-3 sm:p-4">
            <div className="flex flex-col gap-4 w-full min-w-0 overflow-auto border border-gray-200 bg-white shadow-sm rounded-lg p-4 sm:p-6">
                <div className={"flex items-center justify-between w-full"}>
                    <Link
                        href={`/dashboard/teams/${id}`}
                        className={"text-sm text-blue-600 hover:underline"}
                    >
                        Back to team
                    </Link>
                </div>
                {team && (
                    <EditTeamForm team={team} profiles={profiles ?? []} />
                )}
            </div>
        </div>
    );
}