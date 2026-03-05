'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createSkill } from '@/lib/db/skills'

export default function CreateSkillForm({ categories = [] }) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [categoryId, setCategoryId] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim() || !categoryId) return

    setSaving(true)

    try {
      await createSkill(name, Number(categoryId))
      setName('')
      setCategoryId('')
      setOpen(false)
    } catch (error) {
      console.error('Failed to create skill:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='default'>Create new</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create skill</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <FieldGroup>
            <Field>
              <FieldTitle>Skill name (required)</FieldTitle>
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder='e.g. React' required />
            </Field>

            <Field>
              <FieldTitle>Category (required)</FieldTitle>
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

          <Button type='submit' variant='default' disabled={saving || !name.trim() || !categoryId}>
            {saving ? 'Creating...' : 'Create'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
