import { createClient } from "@/lib/supabase/server";
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";

export default async function Page({
                                       params,
                                   }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const supabase = await createClient();

    const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (!project) {
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
                        {project.created_at
                            ? new Date(project.created_at).toLocaleDateString("sv-SE")
                            : "—"}
                    </div>
                </Field>
            </FieldGroup>
        </div>
    );
}
