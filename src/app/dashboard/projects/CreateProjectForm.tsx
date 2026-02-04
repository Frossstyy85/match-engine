import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Field, FieldGroup, FieldTitle} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {supabase} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

async function createProject({ name }: { name: string }){
    const { data, error } = await supabase
        .from('projects')
        .insert({ name })
        .select('id');
    if (error) throw error
    return data
}

export default function CreateProjectForm(){

    const router = useRouter();

    const [name, setName] = useState<string>("");

    const mutation = useMutation({
        mutationFn: createProject,
        onSuccess: (data) => {
            console.log(data)
            const id = data[0].id;
            if (id)
                router.push(`/dashboard/projects/${id}`)
        }
    })

    const handleSave = async () => {
        mutation.mutate({
            name
        })
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Create project</Button>
            </DialogTrigger>
            <DialogHeader>
            </DialogHeader>
            <DialogContent>
                <FieldGroup>
                    <Field>
                        <FieldTitle>Project name (required)</FieldTitle>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={"project x"}
                        />
                    </Field>
                </FieldGroup>
                <Button onClick={handleSave}>Create</Button>
            </DialogContent>
        </Dialog>
    )


}