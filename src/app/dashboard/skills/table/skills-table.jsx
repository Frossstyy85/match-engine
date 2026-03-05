'use client'

import { useState } from 'react'
import { Pen, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import EditSkillForm from '@/app/dashboard/skills/components/edit-skill-form'
import { deleteSkillBy as deleteSkill } from '@/lib/db/skills'
import { ConfirmDeleteDialog } from '@/shared/dialogs/confirm-delete-dialog'

function SkillActionCells({ skill, categories }) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function handleDelete() {
    await deleteSkill(skill.id)
    router.refresh()
  }

  return (
    <>
      <TableCell>
        <Button
          type='button'
          size='sm'
          className='h-8 rounded-md bg-orange-500 px-3 text-white hover:bg-orange-600 focus-visible:ring-orange-500/50'
          onClick={() => setEditOpen(true)}
        >
          <Pen className='h-3.5 w-3.5' />
          Edit
        </Button>
      </TableCell>
      <TableCell>
        <Button
          type='button'
          variant='outline'
          size='icon-sm'
          className='h-8 w-8 text-destructive hover:text-destructive'
          onClick={() => setConfirmOpen(true)}
          aria-label={`Delete ${skill.name}`}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </TableCell>

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
          <TableHead className='w-[110px]'>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className='w-[130px]'>Edit</TableHead>
          <TableHead className='w-[90px]'>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.map((skill) => (
          <TableRow key={skill.id}>
            <TableCell>
              <span className='inline-block max-w-[96px] truncate font-mono text-xs' title={String(skill.id)}>
                {skill.id}
              </span>
            </TableCell>
            <TableCell>{skill.name}</TableCell>
            <TableCell>{skill.skillCategory?.name ?? '-'}</TableCell>
            <SkillActionCells skill={skill} categories={categories} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
