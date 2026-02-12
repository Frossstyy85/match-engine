import Link from "next/link";
import EditTeamForm from "@/app/dashboard/teams/[id]/edit/edit-team-form";


export  default async function Page({ params }){

    const { id } = await params;

    return (
        <div className={"w-full h-screen flex justify-center bg-gray-50"}>
            <div className={"flex flex-col gap-4 w-full max-w-4/5 h-fit mt-5 mb-5 overflow-auto border-gray-200 border bg-white shadow-sm radius rounded p-6"}>
                <div className={"flex items-center justify-between w-full"}>
                    <Link
                        href={`/dashboard/projects/${id}`}
                        className={"text-sm text-blue-600 hover:underline"}
                    >
                        Back to projects
                    </Link>
                </div>
                <EditTeamForm/>
            </div>
        </div>
    )

}