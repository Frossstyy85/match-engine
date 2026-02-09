import { createClient } from "@/lib/supabase/server";
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";

type Props = {
    params: {
        id: string;
    };
};

export default async function Page({ params }: Props) {
    const supabase = await createClient();

    const { data: project, error } = await supabase
        .from("projects")
        .select()
        .eq("id", params.id)
        .single();

    if (error || !project) {
        return <div>Projektet hittades inte</div>;
    }

    return (
        <div>
            <h1>Project</h1>

            <FieldGroup>
                <Field>
                    <FieldTitle>Project name</FieldTitle>
                    <div>{project.name}</div>
                </Field>

                <Field>
                    <FieldTitle>Project ID</FieldTitle>
                    <div>{project.id}</div>
                </Field>

                <Field>
                    <FieldTitle>Created</FieldTitle>
                    <div>
                        {new Date(project.created_at).toLocaleDateString("sv-SE")}
                    </div>
                </Field>
            </FieldGroup>
        </div>
    );
}

