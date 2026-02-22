'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatDateForInput } from '@/lib/helpers/date'
import { createProject } from '@/lib/db/projects'

export default function CreateProjectForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    setSaving(true)
    try {
      const projectId = await createProject({
        name: formData.get('name'),
        description: formData.get('description'),
        startDate: formatDateForInput(startDate) || null,
        endDate: formatDateForInput(endDate) || null
      })

      setOpen(false)
      setStartDate(undefined)
      setEndDate(undefined)

      if (projectId) {
        router.push(`/dashboard/projects/${projectId}`)
      } else {
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='w-fit'>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size='sm'>Create new</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <input type='hidden' name='start_date' value={formatDateForInput(startDate)} />
            <input type='hidden' name='end_date' value={formatDateForInput(endDate)} />

            <FieldGroup>
              <Field>
                <FieldTitle>Project name (required)</FieldTitle>
                <Input name='name' placeholder='project x' required />
              </Field>

              <Field>
                <FieldTitle>Description</FieldTitle>
                <Textarea name='description' placeholder='Optional description' rows={3} />
              </Field>

              <FieldGroup className='flex flex-col gap-4 sm:flex-row sm:gap-6'>
                <Field>
                  <FieldTitle>Start date</FieldTitle>
                  <DatePicker value={startDate} onSelect={setStartDate} />
                </Field>
                <Field>
                  <FieldTitle>End date</FieldTitle>
                  <DatePicker value={endDate} onSelect={setEndDate} />
                </Field>
              </FieldGroup>
            </FieldGroup>

            <Button type='submit' disabled={saving}>
              {saving ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
