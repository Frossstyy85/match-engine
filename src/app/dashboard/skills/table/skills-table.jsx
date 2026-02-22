'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { deleteSkillBy as deleteSkill } from '@/lib/db/skills'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import EditSkillForm from '@/features/skills/components/edit-skill-form'
import { ConfirmDeleteDialog } from '@/shared/dialogs/confirm-delete-dialog'
import { RowActionsMenu } from '@/shared/table/row-actions-menu'

function SkillActions({ skill, categories }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
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
            type: 'action',
            label: 'Edit skill',
            onSelect: () => setEditOpen(true)
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

      <EditSkillForm open={editOpen} onOpenChange={setEditOpen} skill={skill} categories={categories} />

      <ConfirmDeleteDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title='Delete skill?'
        description={`This will remove skill "${skill.name}". This action cannot be undone.`}
        onConfirm={() => {
          void handleDelete()
        }}
      />
    </>
  )
}

export default function SkillsTable({ skills, categories }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.map((skill) => (
          <TableRow key={skill.id}>
            <TableCell>{skill.name}</TableCell>
            <TableCell>{skill.skillCategory?.name ?? '-'}</TableCell>
            <TableCell>
              <SkillActions skill={skill} categories={categories} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
