"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog"
import { deleteTeam } from "@/lib/db/teams"

interface Props {
    teamId: number
    teamName?: string
    redirectTo?: string
}

export function DeleteTeamButton({ teamId, teamName, redirectTo = "/dashboard/teams" }: Props) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-sm text-red-600 hover:underline"
                aria-label={teamName ? `Delete team ${teamName}` : "Delete team"}
            >
                Delete team
            </button>
            <ConfirmDeleteDialog
                open={open}
                onOpenChange={setOpen}
                title="Delete team?"
                description="This will remove the team. This action cannot be undone."
                onConfirm={async () => {
                    await deleteTeam(teamId)
                    router.push(redirectTo)
                }}
            />
        </>
    )
}
