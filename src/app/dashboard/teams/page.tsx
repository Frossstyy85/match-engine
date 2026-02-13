import { tableClasses } from "@/lib/utils";
import CreateTeamForm from "@/app/dashboard/teams/CreateTeamForm";
import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function Page() {


    const supabase = await createClient();

    const { data: teams, error } = await supabase.from("teams").select("*");

    if (error) {
        return (
            <div className="w-full min-w-0 p-4 sm:p-6">
                <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
                    <p className="text-sm text-destructive">{error.message}</p>
                </div>
            </div>
        );
    }

    const teamList = teams ?? [];

    return (
        <div className="w-full min-w-0 p-4 sm:p-6">
            <div className="flex flex-col gap-4 w-full min-w-0">
                <div className="flex w-full justify-end">
                    <CreateTeamForm />
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
                    <table className={tableClasses}>
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teamList.map((team) => (
                                <tr key={team.id}>
                                    <td data-label="Name">
                                        <Link href={`/dashboard/teams/${team.id}`} className="font-medium text-blue-600 hover:underline">
                                            {team.name}
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
