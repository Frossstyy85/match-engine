'use client'

import Link from 'next/link'
import { ArrowLeftIcon, Edit3Icon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getProfiles as fetchProfiles, getTeamById as fetchTeam, getTeamMemberIds as fetchTeamMemberIds } from '@/lib/db/teams'
import EditTeamForm from '@/features/teams/components/edit-team-form'

export default function EditTeamPage({ teamId }) {
  const teamQuery = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => fetchTeam(teamId)
  })

  const profilesQuery = useQuery({
    queryKey: ['profiles'],
    queryFn: fetchProfiles
  })

  const memberIdsQuery = useQuery({
    queryKey: ['team-members', teamId],
    queryFn: () => fetchTeamMemberIds(teamId),
    enabled: Boolean(teamId)
  })

  if (teamQuery.isLoading || profilesQuery.isLoading || memberIdsQuery.isLoading) {
    return <p className='text-muted-foreground text-sm'>Loading team...</p>
  }

  if (teamQuery.error || !teamQuery.data) {
    return <p className='text-destructive text-sm'>Failed to load team.</p>
  }

  const team = teamQuery.data
  const profiles = profilesQuery.data ?? []
  const initialMemberIds = memberIdsQuery.data ?? []

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-3'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <Edit3Icon className='text-muted-foreground size-4.5' />
              <span className='truncate'>Edit team</span>
            </h1>
            <p className='text-muted-foreground text-sm'>{team.name}</p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Button asChild size='sm' variant='ghost'>
              <Link href={`/dashboard/teams/${teamId}`}>
                <ArrowLeftIcon />
                Back
              </Link>
            </Button>
          </div>
        </header>

        <Card className='w-full max-w-4xl border-border shadow-sm'>
          <CardContent className='space-y-3 p-5'>
            {profilesQuery.error ? (
              <p className='text-destructive text-sm'>Failed to load profiles. Team member assignments may be unavailable.</p>
            ) : null}
            <EditTeamForm team={team} profiles={profiles} initialMemberIds={initialMemberIds} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
