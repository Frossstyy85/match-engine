import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { createClient } from '@/lib/supabase/server'
import { fetchTeam } from '@/features/teams/data/teams-repository'
import { DeleteTeamButton } from '@/features/teams/components/delete-team-button'

export default async function TeamDetailsScreen({ teamId }) {
  const team = await fetchTeam(teamId)
  if (!team) notFound()

  const supabase = await createClient()
  const { data: members } = await supabase.from('profiles').select('id, name, email, team_id').eq('team_id', team.id)

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='flex w-full min-w-0 flex-col gap-4 overflow-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
        <div className='flex w-full flex-col gap-3 sm:items-start'>
          <div>
            <div className='flex flex-wrap items-center gap-2 sm:gap-6'>
              <h1 className='text-xl font-semibold sm:text-2xl'>{team.name}</h1>

              <Link href={`/dashboard/teams/${team.id}/edit`} className='text-sm text-blue-600 hover:underline'>
                Edit team
              </Link>

              {team.projectId != null ? (
                <Link href={`/dashboard/projects/${team.projectId}`} className='text-sm text-blue-600 hover:underline'>
                  View project
                </Link>
              ) : null}

              <Link href='/dashboard/teams' className='text-sm text-blue-600 hover:underline'>
                Back to teams
              </Link>

              <DeleteTeamButton teamId={team.id} teamName={team.name} />
            </div>

            <p className='text-sm text-gray-500'>ID: {team.id}</p>
          </div>
        </div>

        <div className='border-t border-gray-200 pt-4'>
          <FieldGroup>
            <Field>
              <FieldTitle>Team name</FieldTitle>
              <div>{team.name}</div>
            </Field>

            <Field>
              <FieldTitle>Team members</FieldTitle>
              <div className='space-y-1 text-sm'>
                {members && members.length > 0 ? (
                  members.map((member) => <div key={member.id}>{member.name ?? member.email ?? 'Unnamed member'}</div>)
                ) : (
                  <div className='text-gray-400'>No members in this team.</div>
                )}
              </div>
            </Field>
          </FieldGroup>
        </div>
      </div>
    </div>
  )
}
