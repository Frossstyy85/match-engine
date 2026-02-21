'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { deleteSkill } from '@/features/skills/actions/skill-actions'
import { ConfirmDeleteDialog } from '@/shared/dialogs/confirm-delete-dialog'
import { RowActionsMenu } from '@/shared/table/row-actions-menu'

function SkillActions({ skill }) {
  const router = useRouter()
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function handleDelete() {
    await deleteSkill(skill.id)
    router.refresh()
  }

  return (
    <>
      <RowActionsMenu
        items={[
          {
            type: 'link',
            label: 'View skill',
            href: `/dashboard/skills/${skill.id}/edit`
          },
          {
            type: 'link',
            label: 'Edit skill',
            href: `/dashboard/skills/${skill.id}/edit`
          },
          { type: 'separator' },
          {
            type: 'action',
            label: 'Delete skill',
            destructive: true,
            onSelect: () => setConfirmOpen(true)
          }
        ]}
      />

      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title='Delete skill?'
        description={`This will remove skill \"${skill.name}\". This action cannot be undone.`}
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
    accessorKey: 'name'
  },
  {
    header: 'Category',
    accessorKey: 'skillCategory',
    cell: ({ row }) => row.original.skillCategory?.name ?? '-'
  },
  {
    id: 'actions',
    cell: ({ row }) => <SkillActions skill={row.original} />
  }
]
