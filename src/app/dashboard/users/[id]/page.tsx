import {createClient} from "@/lib/supabase/server";

type props = {
    params: {
        id: string
    }
}

export default async function Page({params}: props) {

    const {id} = await params;

    const supabase = await createClient();
    const {data: user} = await supabase.from('profiles').select().eq('id', id).single();


    return (
        <div>
            <pre>{JSON.stringify(user, null, 3)}</pre>
        </div>
    )


}