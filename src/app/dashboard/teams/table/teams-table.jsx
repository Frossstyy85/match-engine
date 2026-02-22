'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { deleteTeam } from '@/lib/db/teams'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
        description={`This will remove team "${team.name}". This action cannot be undone.`}
        onConfirm={() => {
          void handleDelete()
        }}
      />
    </>
  )
}

export default function TeamsTable({ teams }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Project ID</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>
              <Link href={`/dashboard/teams/${team.id}`}>{team.name}</Link>
            </TableCell>
            <TableCell>{team.projectId ?? '-'}</TableCell>
            <TableCell>
              <TeamActions team={team} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
