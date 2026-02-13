import {createClient} from "@/lib/supabase/server";

type PageProps = { params: Promise<{ id: string }> };

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    const supabase = await createClient();
    const {data: user} = await supabase.from('profiles').select().eq('id', id).single();


    return (
        <div>
            <pre>{JSON.stringify(user, null, 3)}</pre>
        </div>
    )


}