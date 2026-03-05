'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { deleteTeam } from '@/lib/db/teams'
import { ConfirmDeleteDialog } from '@/shared/dialogs/confirm-delete-dialog'

export function DeleteTeamButton({ teamId, teamName, redirectTo = '/dashboard/teams' }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type='button' variant='destructive' size='sm' onClick={() => setOpen(true)}>
        Delete team
      </Button>

      <ConfirmDeleteDialog
        open={open}
        onOpenChange={setOpen}
        title='Delete team?'
        description='This will remove the team. This action cannot be undone.'
        onConfirm={async () => {
          await deleteTeam(teamId)
          router.push(redirectTo)
        }}
      />
    </>
  )
}
