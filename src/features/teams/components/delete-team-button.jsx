'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { deleteTeam } from '@/features/teams/actions/team-actions'
import { ConfirmDeleteDialog } from '@/shared/dialogs/confirm-delete-dialog'

export function DeleteTeamButton({ teamId, teamName, redirectTo = '/dashboard/teams' }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='text-sm text-red-600 hover:underline'
        aria-label={teamName ? `Delete team ${teamName}` : 'Delete team'}
      >
        Delete team
      </button>

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
