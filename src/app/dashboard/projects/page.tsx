import { tableClasses } from "@/lib/utils";
import CreateProjectForm from "@/app/dashboard/projects/CreateProjectForm";
import {createClient} from "@/lib/supabase/server";
import Link from "next/link";

export default async function Page() {

    const supabase = await createClient();

    const {data: projects, error} = await supabase.from('projects').select()
    if (error) {
        console.error(error)
        return <div>Error: {error.message}</div>
    }

    return (
        <div className={"w-full h-screen flex justify-center"}>
            <div
                className={"flex flex-col gap-0 max-w-4/5 h-fit mt-5 overflow-auto border-gray-300 border radius rounded"}>
                <div className={"justify-end flex w-full mb-3 p-1"}>
                    <CreateProjectForm/>
                </div>
                <table className={tableClasses}>
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Project lead</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.id}</td>
                            <td><Link href={`/dashboard/projects/${project.id}`}>{project.name}</Link></td>
                            <td>{project.status}</td>
                            <td>{project.start_date}</td>
                            <td>{project.end_date}</td>
                            <td>_</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}