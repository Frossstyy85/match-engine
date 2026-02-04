import {createClient} from "@/lib/supabase/server";

type props = {
    params: {
        id: string
    }
}

export default async function Page({params}: props) {

    const {id} = await params;

    const supabase = await createClient();
    const {data: project} = await supabase.from('projects').select().eq('id', id).single();


    return (
        <div>
            <pre>{JSON.stringify(project, null, 3)}</pre>
        </div>
    )

}