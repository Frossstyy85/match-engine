"use client"

import * as React from "react"
import {Field, FieldGroup} from "@/components/ui/field";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Input} from "@/components/ui/input";
import {DatePicker} from "@/components/ui/date-picker";
import {Button} from "@/components/ui/button";
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxItem,
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
    ComboboxValue,
    useComboboxAnchor,
} from "@/components/ui/combobox";
import type { Project, SkillCategory } from "@/lib/types";
import { formatDateForInput } from "@/lib/helpers/date";
import { updateProject } from "@/lib/db/projects";

interface EditProjectFormProps {
    project: Pick<Project, "id" | "name" | "description" | "start_date" | "end_date">
    skills: SkillCategory[]
    projectSkills?: string[]
}

export default function EditProjectForm({ project, skills, projectSkills = [] }: EditProjectFormProps) {
    const anchor = useComboboxAnchor()

    const [name, setName] = React.useState<string>(project.name ?? "")
    const [description, setDescription] = React.useState<string>(project.description ?? "")
    const [startDate, setStartDate] = React.useState<Date | undefined>(
        project.start_date ? new Date(project.start_date) : undefined
    )
    const [endDate, setEndDate] = React.useState<Date | undefined>(
        project.end_date ? new Date(project.end_date) : undefined
    )
    const [selectedSkills, setSelectedSkills] = React.useState<string[]>(projectSkills)
    const [saving, setSaving] = React.useState(false)

    const allSkillNames = React.useMemo(
        () => skills.flatMap((cat) => cat.skills.map((s) => s.name)),
        [skills]
    )

    async function handleSave() {
        if (!name.trim()) return

        setSaving(true)
        try {
            await updateProject(
                project.id,
                {
                    name: name.trim(),
                    description: description.trim() || undefined,
                    start_date: formatDateForInput(startDate) || null,
                    end_date: formatDateForInput(endDate) || null,
                },
                selectedSkills
            )
        } catch (e) {
            console.error("Failed to save project:", e)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className={"space-y-6"}>
            <Field>
                <Label>
                    Name
                    <span className="text-destructive">*</span>
                </Label>
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Project name"
                />
            </Field>
            <Field>
                <Label>
                    Description
                </Label>
                <Textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional description"
                />
            </Field>
            <FieldGroup className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Field>
                    <Label>Start date</Label>
                    <DatePicker value={startDate} onSelect={setStartDate} />
                </Field>
                <Field>
                    <Label>End date</Label>
                    <DatePicker value={endDate} onSelect={setEndDate} />
                </Field>
            </FieldGroup>

            <Field>
                <Label>Requirements</Label>
                <Combobox
                    multiple
                    autoHighlight
                    items={allSkillNames}
                    value={selectedSkills}
                    onValueChange={setSelectedSkills}
                >
                    <ComboboxChips ref={anchor} className="w-full max-w-sm min-w-0">
                        <ComboboxValue>
                            {(values: string[]) => (
                                <React.Fragment>
                                    {values.map((v) => (
                                        <ComboboxChip key={v}>{v}</ComboboxChip>
                                    ))}
                                    <ComboboxChipsInput placeholder="Search skills..." />
                                </React.Fragment>
                            )}
                        </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>No skills found.</ComboboxEmpty>
                        <ComboboxList>
                            {skills.map((category, index) => (
                                <React.Fragment key={category.id}>
                                    {index > 0 && <ComboboxSeparator />}
                                    <ComboboxGroup>
                                        <ComboboxLabel>{category.name}</ComboboxLabel>
                                        {category.skills.map((skill) => (
                                            <ComboboxItem key={skill.id} value={skill.name}>
                                                {skill.name}
                                            </ComboboxItem>
                                        ))}
                                    </ComboboxGroup>
                                </React.Fragment>
                            ))}
                        </ComboboxList>
                    </ComboboxContent>
                </Combobox>
            </Field>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>
                {saving ? "Saving..." : "Save"}
            </Button>
        </div>
    )
}
