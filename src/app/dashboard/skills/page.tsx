import "@/components/table/table.css";
import {createClient} from "@/lib/supabase/server";

export default async function Page() {

    const supabase = await createClient()

    const {data: skills} = await supabase.from("skills").select()

    return (
        <div className={"w-full h-screen flex justify-center"}>
            <div
                className={"flex flex-col gap-0 max-w-4/5 h-fit mt-5 overflow-auto border-gray-300 border radius rounded w-full"}>
                <div className={"justify-end flex w-full mb-3 p-1"}>
                </div>
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {skills.map(skill => (
                        <tr key={skill.id}>
                            <td>{skill.id}</td>
                            <td>{skill.name}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}