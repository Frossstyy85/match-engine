import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Field, FieldGroup, FieldTitle} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {useMutation} from "@tanstack/react-query";
import {useState} from "react";
import {supabase} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

async function createTeam({ name }: { name: string }){
    const { data, error } = await supabase
        .from('teams')
        .insert({ name })
        .select('id');
    if (error) throw error
    return data
}

export default function CreateTeamForm(){

    const router = useRouter();

    const [name, setName] = useState<string>("");

    const mutation = useMutation({
        mutationFn: createTeam,
        onSuccess: (data) => {
            const id = data[0].id;
            if (id)
                router.push(`/dashboard/teams/${id}`)
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
                <Button>Create team</Button>
            </DialogTrigger>
            <DialogHeader>
            </DialogHeader>
            <DialogContent>
                <FieldGroup>
                    <Field>
                        <FieldTitle>Team name (required)</FieldTitle>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={"team x"}
                        />
                    </Field>
                </FieldGroup>
                <Button onClick={handleSave}>Create</Button>
            </DialogContent>
        </Dialog>
    )


}