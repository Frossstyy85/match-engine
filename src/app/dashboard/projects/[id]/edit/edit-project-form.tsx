"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
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
import type { Project, SkillCategory, Team } from "@/lib/types";
import { formatDateForInput } from "@/lib/helpers/date";
import { updateProject } from "@/lib/db/projects";
import { createTeamForProject, deleteTeam } from "@/lib/db/teams";
import { Trash2 } from "lucide-react";

interface EditProjectFormProps {
    project: Pick<Project, "id" | "name" | "description" | "start_date" | "end_date">
    skills: SkillCategory[]
    projectSkills?: string[]
    teams?: Team[]
}

export default function EditProjectForm({ project, skills, projectSkills = [], teams = [] }: EditProjectFormProps) {
    const router = useRouter()
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
    const [addTeamOpen, setAddTeamOpen] = React.useState(false)
    const [deletingId, setDeletingId] = React.useState<number | null>(null)

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

    async function handleDeleteTeam(teamId: number) {
        setDeletingId(teamId)
        try {
            await deleteTeam(teamId)
            router.refresh()
        } catch (e) {
            console.error("Failed to delete team:", e)
        } finally {
            setDeletingId(null)
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
                <Label>Teams</Label>
                <div className="flex flex-col gap-2">
                    {teams.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No teams yet.</p>
                    ) : (
                        <ul className="flex flex-col gap-1.5">
                            {teams.map((team) => (
                                <li
                                    key={team.id}
                                    className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
                                >
                                    <Link
                                        href={`/dashboard/teams/${team.id}`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {team.name}
                                    </Link>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 text-destructive hover:text-destructive"
                                        disabled={deletingId === team.id}
                                        onClick={() => handleDeleteTeam(team.id)}
                                        aria-label={`Delete ${team.name}`}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )}
                    <Dialog open={addTeamOpen} onOpenChange={setAddTeamOpen}>
                        <DialogTrigger asChild>
                            <Button type="button" variant="outline" size="sm" className="w-fit">
                                Add team
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add team</DialogTitle>
                            </DialogHeader>
                            <form
                                action={async (formData) => {
                                    await createTeamForProject(project.id, formData)
                                    setAddTeamOpen(false)
                                    router.refresh()
                                }}
                                className="flex flex-col gap-4"
                            >
                                <FieldGroup>
                                    <Field>
                                        <Label>Team name</Label>
                                        <Input name="name" placeholder="Team name" required />
                                    </Field>
                                </FieldGroup>
                                <Button type="submit">Create</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </Field>

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
