'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { updateTeamMembers } from '@/lib/db/teams'

export default function EditTeamForm({ team, profiles, initialMemberIds = [] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [selected, setSelected] = React.useState(initialMemberIds)

  React.useEffect(() => {
    setSelected(initialMemberIds)
  }, [initialMemberIds.join(',')])

  function toggleMember(id) {
    setSelected((previous) => (previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const memberIds = Array.from(formData.getAll('memberIds'))

    startTransition(async () => {
      await updateTeamMembers(team.id, memberIds)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <FieldGroup>
        <Field>
          <FieldTitle>Team name</FieldTitle>
          <div className='text-sm font-medium'>{team.name}</div>
        </Field>

        <Field>
          <FieldTitle>Members</FieldTitle>
          <div className='border-border max-h-64 overflow-auto rounded-md border p-3 text-sm'>
            <div className='flex flex-col gap-2'>
              {profiles.length === 0 ? <p className='text-muted-foreground'>No profiles available.</p> : null}

              {profiles.map((profile) => (
                <label key={profile.id} className='flex cursor-pointer items-center gap-2 rounded-sm px-1 py-1'>
                  <input
                    type='checkbox'
                    name='memberIds'
                    value={profile.id}
                    checked={selected.includes(profile.id)}
                    onChange={() => toggleMember(profile.id)}
                  />

                  <span>{profile.name ?? profile.email ?? 'Unnamed'}</span>
                </label>
              ))}
            </div>
          </div>

          <p className='text-muted-foreground mt-1 text-xs'>
            Select which profiles should belong to this team. Saving will update team membership.
          </p>
        </Field>
      </FieldGroup>

      <Button type='submit' disabled={isPending}>
        {isPending ? 'Saving...' : 'Save changes'}
      </Button>
    </form>
  )
}
