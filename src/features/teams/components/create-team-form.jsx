'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { createTeam } from '@/features/teams/actions/team-actions'

export default function CreateTeamForm() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create team</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
        </DialogHeader>

        <form
          action={async (formData) => {
            await createTeam(formData)
            setOpen(false)
          }}
        >
          <FieldGroup>
            <Field>
              <FieldTitle>Team name (required)</FieldTitle>
              <Input name='name' placeholder='Team name' required />
            </Field>
          </FieldGroup>

          <Button type='submit'>Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
