'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateSkill } from '@/lib/db/skills'

export default function EditSkillForm({ open, onOpenChange, skill, categories }) {
  const [name, setName] = React.useState(skill.name ?? '')
  const [categoryId, setCategoryId] = React.useState(skill.categoryId ? String(skill.categoryId) : '')
  const [saving, setSaving] = React.useState(false)

  React.useEffect(() => {
    if (!open) return
    setName(skill.name ?? '')
    setCategoryId(skill.categoryId ? String(skill.categoryId) : '')
  }, [open, skill.categoryId, skill.name])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim() || !categoryId) return

    setSaving(true)

    try {
      await updateSkill(skill.id, name, Number(categoryId))
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update skill:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit skill</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <FieldGroup>
            <Field>
              <FieldTitle>Name</FieldTitle>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder='e.g. React' required />
            </Field>

            <Field>
              <FieldTitle>Category</FieldTitle>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select category' />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <Button type='submit' disabled={saving || !name.trim() || !categoryId}>
            {saving ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
