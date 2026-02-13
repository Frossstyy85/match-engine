import { createClient } from "@/lib/supabase/server";
import TeamsTable from "@/app/dashboard/teams/TeamsTable";

export default async function Page() {
    const supabase = await createClient();

    const { data: teams, error } = await supabase.from("teams").select("*");

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                <p className="text-sm text-destructive">{error.message}</p>
            </div>
        );
    }

    const teamList = teams ?? [];

    return <TeamsTable data={teamList} />;
}
