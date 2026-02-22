'use client'

import Link from 'next/link'
import { Edit3Icon, ListIcon, UsersRoundIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { getTeamById as fetchTeam, getTeamMembers as fetchTeamMembers } from '@/lib/db/teams'
import { DeleteTeamButton } from '@/features/teams/components/delete-team-button'

export default function TeamDetailsPage({ teamId }) {
  const teamQuery = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => fetchTeam(teamId)
  })

  const membersQuery = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => fetchTeamMembers(teamId)
  })

  if (teamQuery.isLoading || membersQuery.isLoading) {
    return <p className='text-muted-foreground text-sm'>Loading team...</p>
  }

  if (teamQuery.error || !teamQuery.data) {
    return <p className='text-destructive text-sm'>Failed to load team.</p>
  }

  const team = teamQuery.data
  const members = membersQuery.data ?? []

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-3'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <UsersRoundIcon className='text-muted-foreground size-4.5' />
              <span className='truncate'>{team.name}</span>
            </h1>
            <p className='text-muted-foreground text-sm'>{`Team ID: ${team.id}`}</p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Button asChild size='sm' variant='default'>
              <Link href={`/dashboard/teams/${team.id}/edit`}>
                <Edit3Icon />
                Edit
              </Link>
            </Button>
            {team.projectId != null ? (
              <Button asChild size='sm' variant='ghost'>
                <Link href={`/dashboard/projects/${team.projectId}`}>View project</Link>
              </Button>
            ) : null}
            <Button asChild size='sm' variant='ghost'>
              <Link href='/dashboard/teams'>
                <ListIcon />
                All teams
              </Link>
            </Button>
            <DeleteTeamButton teamId={team.id} teamName={team.name} />
          </div>
        </header>

        <Card className='w-full max-w-4xl border-border shadow-sm'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-base'>Team details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <FieldGroup>
              <Field>
                <FieldTitle>Team name</FieldTitle>
                <div>{team.name}</div>
              </Field>

              <Field>
                <FieldTitle>Team members</FieldTitle>
                <div className='space-y-1 text-sm'>
                  {membersQuery.error ? (
                    <div className='text-destructive'>Failed to load team members.</div>
                  ) : members && members.length > 0 ? (
                    members.map((member) => <div key={member.id}>{member.name ?? member.email ?? 'Unnamed member'}</div>)
                  ) : (
                    <div className='text-muted-foreground'>No members in this team.</div>
                  )}
                </div>
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
