'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { deleteProject } from '@/lib/db/projects'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/helpers'
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
        description={`This will remove project "${project.name}". This action cannot be undone.`}
        onConfirm={() => {
          void handleDelete()
        }}
      />
    </>
  )
}

export default function ProjectsTable({ projects }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Start date</TableHead>
          <TableHead>End date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project.id}>
            <TableCell>
              <Link href={`/dashboard/projects/${project.id}`}>{project.name}</Link>
            </TableCell>
            <TableCell>{formatDate(project.startDate)}</TableCell>
            <TableCell>{formatDate(project.endDate)}</TableCell>
            <TableCell>
              <ProjectActions project={project} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
