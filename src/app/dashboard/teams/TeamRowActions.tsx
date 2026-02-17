"use client"

import { useState } from "react"
import Link from "next/link"
import { Team } from "@/lib/types"
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
import { deleteTeam } from "@/lib/db/teams"

interface Props {
    team: Team
}

export default function TeamRowActions({ team }: Props) {
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
                        <Link href={`/dashboard/teams/${team.id}`}>
                            View team
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link href={`/dashboard/teams/${team.id}/edit`}>
                            Edit team
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="text-destructive"
                        onSelect={(e) => {
                            e.preventDefault()
                            setConfirmOpen(true)
                        }}
                    >
                        Delete team
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <ConfirmDeleteDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete team?"
                description="This will remove the team. This action cannot be undone."
                onConfirm={async () => deleteTeam(team.id)}
            />
        </>
    )
}
