'use client'

import * as React from 'react'
import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { updateTeamMembers } from '@/features/teams/actions/team-actions'

export default function EditTeamForm({ team, profiles }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const initialMemberIds = React.useMemo(
    () => profiles.filter((profile) => profile.team_id === team.id).map((profile) => profile.id),
    [profiles, team.id]
  )

  const [selected, setSelected] = React.useState(initialMemberIds)

  function toggleMember(id) {
    setSelected((previous) => (previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]))
  }

  async function handleSubmit(formData) {
    const memberIds = Array.from(formData.getAll('memberIds'))

    startTransition(async () => {
      await updateTeamMembers(team.id, memberIds)
      router.refresh()
    })
  }

  return (
    <form action={handleSubmit} className='space-y-6'>
      <FieldGroup>
        <Field>
          <FieldTitle>Team name</FieldTitle>
          <div>{team.name}</div>
        </Field>

        <Field>
          <FieldTitle>Members</FieldTitle>
          <div className='max-h-64 overflow-auto rounded border border-gray-200 p-2 text-sm'>
            <div className='flex flex-col gap-2'>
              {profiles.length === 0 ? <p className='text-gray-400'>No profiles available.</p> : null}

              {profiles.map((profile) => (
                <label key={profile.id} className='flex cursor-pointer items-center gap-2'>
                  <input
                    type='checkbox'
                    name='memberIds'
                    value={profile.id}
                    checked={selected.includes(profile.id)}
                    onChange={() => toggleMember(profile.id)}
                  />

                  <span>
                    {profile.name ?? profile.email ?? 'Unnamed'}{' '}
                    {profile.team_id && profile.team_id !== team.id ? (
                      <span className='text-xs text-gray-400'>(in another team)</span>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <p className='mt-1 text-xs text-gray-500'>
            Select which profiles should belong to this team. Saving will update team membership.
          </p>
        </Field>
      </FieldGroup>

      <button
        type='submit'
        className='inline-flex items-center rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60'
        disabled={isPending}
      >
        {isPending ? 'Saving...' : 'Save changes'}
      </button>
    </form>
  )
}
