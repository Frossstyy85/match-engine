"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog"
import { deleteProject } from "@/lib/db/projects"

interface Props {
    projectId: number
    projectName?: string
}

export function DeleteProjectButton({ projectId, projectName }: Props) {
    const router = useRouter()
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="text-sm text-red-600 hover:underline"
                aria-label={projectName ? `Delete project ${projectName}` : "Delete project"}
            >
                Delete project
            </button>
            <ConfirmDeleteDialog
                open={open}
                onOpenChange={setOpen}
                title="Delete project?"
                description="This will remove the project and its data. This action cannot be undone."
                onConfirm={async () => {
                    await deleteProject(projectId)
                    router.push("/dashboard/projects")
                }}
            />
        </>
    )
}
