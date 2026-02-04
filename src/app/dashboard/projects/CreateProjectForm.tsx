"use client";

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Field, FieldGroup, FieldTitle} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {createProject} from "@/lib/db/projects";
import {useState} from "react";

export default function CreateProjectForm() {

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create project</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create project</DialogTitle>
                </DialogHeader>

                <form
                    action={async (formData) => {
                        await createProject(formData);
                        setOpen(false);
                    }}
                >
                    <FieldGroup>
                        <Field>
                            <FieldTitle>Project name (required)</FieldTitle>
                            <Input name="name" placeholder="project x" required/>
                        </Field>
                    </FieldGroup>

                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
