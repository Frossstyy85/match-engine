'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { deleteProject } from '@/lib/db/projects'
import { ConfirmDeleteDialog } from '@/shared/dialogs/confirm-delete-dialog'

export function DeleteProjectButton({ projectId, projectName }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type='button' variant='destructive' size='sm' onClick={() => setOpen(true)}>
        Delete project
      </Button>

      <ConfirmDeleteDialog
        open={open}
        onOpenChange={setOpen}
        title='Delete project?'
        description='This will remove the project and its data. This action cannot be undone.'
        onConfirm={async () => {
          await deleteProject(projectId)
          router.push('/dashboard/projects')
        }}
      />
    </>
  )
}
