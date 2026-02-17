"use client"

import { useState } from "react"
import Link from "next/link"
import type { SkillWithCategory } from "@/lib/types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog"
import { deleteSkill } from "@/lib/db/skills"

interface Props {
    skill: SkillWithCategory
}

export default function SkillRowActions({ skill }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false)

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" avoidCollisions={false}>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/skills/${skill.id}/edit`}>
                            Edit skill
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-destructive"
                        onSelect={(e) => {
                            e.preventDefault()
                            setConfirmOpen(true)
                        }}
                    >
                        Delete skill
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDeleteDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete skill?"
                description="This will remove the skill. This action cannot be undone."
                onConfirm={async () => deleteSkill(skill.id)}
            />
        </>
    )
}
