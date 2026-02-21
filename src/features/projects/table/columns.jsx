'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { formatDate } from '@/lib/helpers'
import { deleteProject } from '@/features/projects/actions/project-actions'
import { ConfirmDeleteDialog } from '@/shared/dialogs/confirm-delete-dialog'
import { RowActionsMenu } from '@/shared/table/row-actions-menu'

function ProjectActions({ project }) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function handleDelete() {
    await deleteProject(project.id)
    router.refresh()
  }

  return (
    <>
      <RowActionsMenu
        items={[
          {
            type: 'link',
            label: 'View project',
            href: `/dashboard/projects/${project.id}`
          },
          {
            type: 'link',
            label: 'Edit project',
            href: `/dashboard/projects/${project.id}/edit`
          },
          { type: 'separator' },
          {
            type: 'action',
            label: 'Delete project',
            destructive: true,
            onSelect: () => setConfirmOpen(true)
          }
        ]}
      />

      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title='Delete project?'
        description={`This will remove project \"${project.name}\". This action cannot be undone.`}
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
      const project = row.original
      return <Link href={`/dashboard/projects/${project.id}`}>{project.name}</Link>
    }
  },
  {
    header: 'Start date',
    accessorKey: 'startDate',
    cell: ({ row }) => formatDate(row.original.startDate)
  },
  {
    header: 'End date',
    accessorKey: 'endDate',
    cell: ({ row }) => formatDate(row.original.endDate)
  },
  {
    id: 'actions',
    cell: ({ row }) => <ProjectActions project={row.original} />
  }
]
