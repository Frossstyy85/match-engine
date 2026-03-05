'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Pen, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { deleteTeam } from '@/lib/db/teams'
import { ConfirmDeleteDialog } from '@/shared/dialogs/confirm-delete-dialog'

function TeamActions({ team }) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function handleDelete() {
    await deleteTeam(team.id)
    router.refresh()
  }

  return (
    <>
      <Button
        type='button'
        variant='outline'
        size='icon-sm'
        className='h-8 w-8 text-destructive hover:text-destructive'
        onClick={() => setConfirmOpen(true)}
        aria-label={`Delete ${team.name}`}
      >
        <Trash2 className='h-4 w-4' />
      </Button>

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
          <TableHead className='w-[110px]'>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className='w-[130px]'>Edit</TableHead>
          <TableHead className='w-[90px]'>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>
              <span className='inline-block max-w-[96px] truncate font-mono text-xs' title={String(team.id)}>
                {team.id}
              </span>
            </TableCell>
            <TableCell>
              <Link href={`/dashboard/teams/${team.id}`}>{team.name}</Link>
            </TableCell>
            <TableCell>
              <Button
                asChild
                size='sm'
                className='h-8 rounded-md bg-orange-500 px-3 text-white hover:bg-orange-600 focus-visible:ring-orange-500/50'
              >
                <Link href={`/dashboard/teams/${team.id}/edit`}>
                  <Pen className='h-3.5 w-3.5' />
                  Edit
                </Link>
              </Button>
            </TableCell>
            <TableCell>
              <TeamActions team={team} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
