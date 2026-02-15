"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldTitle } from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createSkill } from "@/lib/db/skills"

interface CreateSkillFormProps {
    categories: { id: number; name: string }[]
}

export default function CreateSkillForm({ categories }: CreateSkillFormProps) {
    const queryClient = useQueryClient()
    const [open, setOpen] = React.useState(false)
    const [name, setName] = React.useState("")
    const [categoryId, setCategoryId] = React.useState<string>("")
    const [saving, setSaving] = React.useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim() || !categoryId) return

        setSaving(true)
        try {
            await createSkill(name, Number(categoryId))
            queryClient.invalidateQueries({ queryKey: ["skills"] })
            setName("")
            setCategoryId("")
            setOpen(false)
        } catch (err) {
            console.error("Failed to create skill:", err)
        } finally {
            setSaving(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Create skill</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create skill</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <FieldGroup>
                        <Field>
                            <FieldTitle>Skill name (required)</FieldTitle>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. React"
                                required
                            />
                        </Field>
                        <Field>
                            <FieldTitle>Category (required)</FieldTitle>
                            <Select value={categoryId} onValueChange={setCategoryId} required>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={String(cat.id)}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                    <Button type="submit" variant="default" disabled={saving || !name.trim() || !categoryId}>
                        {saving ? "Creating..." : "Create"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
