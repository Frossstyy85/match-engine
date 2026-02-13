import { createClient } from "@/lib/supabase/server";

import ProjectsTable from "@/app/dashboard/projects/ProjectsTable";
import CreateProjectForm from "@/app/dashboard/projects/CreateProjectForm";

const pageSize = 10000;

export default async function Page({ searchParams }) {

    const params = await searchParams;

    const supabase = await createClient();

    const page = parseInt(params?.page || '1',10);



    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, count, error } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .range(from, to)
        .order('created_at', { ascending: false });


    console.log(Math.ceil(count / pageSize))




    return (
        <>
            <div>
            <CreateProjectForm/>
            </div>
            <ProjectsTable data={data}/>
        </>
    );
}