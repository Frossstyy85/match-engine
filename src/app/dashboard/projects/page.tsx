import { tableClasses } from "@/lib/utils";
import { formatDate } from "@/lib/helpers/date";
import CreateProjectForm from "@/app/dashboard/projects/CreateProjectForm";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function Page() {

    const supabase = await createClient();

    const {data: projects, error} = await supabase.from('projects').select()
    if (error) {
        console.error(error)
        return <div>Error: {error.message}</div>
    }

    return (
        <div className="w-full min-w-0 p-4 sm:p-6">
            <div className="flex flex-col gap-4 w-full min-w-0">
                <div className="flex w-full justify-end">
                    <CreateProjectForm />
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
                    <table className={tableClasses}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Start date</th>
                                <th>End date</th>
                                <th>Project lead</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td data-label="Name">
                                        <Link href={`/dashboard/projects/${project.id}`} className="font-medium text-blue-600 hover:underline">
                                            {project.name}
                                        </Link>
                                    </td>
                                    <td data-label="Status">{project.status ?? "—"}</td>
                                    <td data-label="Start date">{formatDate(project.start_date)}</td>
                                    <td data-label="End date">{formatDate(project.end_date)}</td>
                                    <td data-label="Project lead">—</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}