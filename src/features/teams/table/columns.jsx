'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { deleteTeam } from '@/features/teams/actions/team-actions'
import { ConfirmDeleteDialog } from '@/shared/dialogs/confirm-delete-dialog'
import { RowActionsMenu } from '@/shared/table/row-actions-menu'

function TeamActions({ team }) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function handleDelete() {
    await deleteTeam(team.id)
    router.refresh()
  }

  return (
    <>
      <RowActionsMenu
        items={[
          {
            type: 'link',
            label: 'View team',
            href: `/dashboard/teams/${team.id}`
          },
          {
            type: 'link',
            label: 'Edit team',
            href: `/dashboard/teams/${team.id}/edit`
          },
          { type: 'separator' },
          {
            type: 'action',
            label: 'Delete team',
            destructive: true,
            onSelect: () => setConfirmOpen(true)
          }
        ]}
      />

      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title='Delete team?'
        description={`This will remove team \"${team.name}\". This action cannot be undone.`}
        onConfirm={() => {
          void handleDelete()
        }}
      />
    </>
  )
}

export const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
    cell: ({ row }) => {
      const team = row.original
      return <Link href={`/dashboard/teams/${team.id}`}>{team.name}</Link>
    }
  },
  {
    header: 'Project ID',
    accessorKey: 'projectId',
    cell: ({ row }) => row.original.projectId ?? '-'
  },
  {
    id: 'actions',
    cell: ({ row }) => <TeamActions team={row.original} />
  }
]
