"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { formatDateForInput } from "@/lib/helpers/date";
import { createProject } from "@/lib/db/projects";

export default function CreateProjectForm() {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

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
                        setStartDate(undefined);
                        setEndDate(undefined);
                    }}
                    className="flex flex-col gap-4"
                >
                    <input
                        type="hidden"
                        name="start_date"
                        value={formatDateForInput(startDate)}
                    />
                    <input
                        type="hidden"
                        name="end_date"
                        value={formatDateForInput(endDate)}
                    />

                    <FieldGroup>
                        <Field>
                            <FieldTitle>Project name (required)</FieldTitle>
                            <Input name="name" placeholder="project x" required />
                        </Field>
                        <Field>
                            <FieldTitle>Description</FieldTitle>
                            <Textarea
                                name="description"
                                placeholder="Optional description"
                                rows={3}
                            />
                        </Field>
                        <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                            <Field>
                                <FieldTitle>Start date</FieldTitle>
                                <DatePicker value={startDate} onSelect={setStartDate} />
                            </Field>
                            <Field>
                                <FieldTitle>End date</FieldTitle>
                                <DatePicker value={endDate} onSelect={setEndDate} />
                            </Field>
                        </FieldGroup>
                    </FieldGroup>

                    <Button type="submit">Create</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
