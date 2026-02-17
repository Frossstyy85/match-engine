"use client"

import { useState } from "react"
import Link from "next/link"
import { Project } from "@/lib/types"

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
import {deleteProject} from "@/lib/db/projects";

interface Props {
    project: Project
}

export default function ProjectRowActions({ project }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false)

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" avoidCollisions={false}>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/projects/${project.id}`}>
                            View project
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/projects/${project.id}/edit`}>
                            Edit project
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-destructive"
                        onSelect={(e) => {
                            e.preventDefault()
                            setConfirmOpen(true)
                        }}
                    >
                        Delete project
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDeleteDialog
                open={confirmOpen}
                onOpenChange={() => setConfirmOpen(false)}
                onConfirm={async () => deleteProject(project.id)}
                />
        </>
    )
}
