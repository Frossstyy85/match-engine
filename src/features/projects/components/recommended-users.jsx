'use client'

import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getRecommendedUsers as fetchRecommendedUsers } from '@/lib/db/projects'
import { assignMemberToTeam } from '@/lib/db/teams'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger
} from '@/components/ui/popover'

export default function RecommendedUsers({ projectId, teams = [] }) {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendedUsers', projectId],
    queryFn: () => fetchRecommendedUsers(projectId)
  })

  const [openUserId, setOpenUserId] = useState(null)
  const [assigningKey, setAssigningKey] = useState(null)
  const [assignErrorByUser, setAssignErrorByUser] = useState({})
  const [assignedTeamByUser, setAssignedTeamByUser] = useState({})

  async function handleAssign(userId, team) {
    const key = `${userId}:${team.id}`
    setAssigningKey(key)
    setAssignErrorByUser((previous) => ({ ...previous, [userId]: null }))

    try {
      await assignMemberToTeam(userId, team.id)
      setAssignedTeamByUser((previous) => ({ ...previous, [userId]: team.name }))
      setOpenUserId(null)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['project', projectId] }),
        queryClient.invalidateQueries({ queryKey: ['team-members', team.id] }),
        queryClient.invalidateQueries({ queryKey: ['team', team.id] }),
        queryClient.invalidateQueries({ queryKey: ['recommendedUsers', projectId] })
      ])
    } catch {
      setAssignErrorByUser((previous) => ({
        ...previous,
        [userId]: 'Failed to add this user to the selected team.'
      }))
    } finally {
      setAssigningKey(null)
    }
  }

  if (isLoading) return <p className='text-muted-foreground text-sm'>Loading recommendations...</p>
  if (error) return <p className='text-destructive text-sm'>Failed to load recommendations.</p>

  return (
    <div className='space-y-2'>
      <p className='text-sm font-medium'>Top candidates</p>
      <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
        {(data ?? []).length > 0 ? (
          (data ?? []).map((user) => {
            const assignError = assignErrorByUser[user.id]
            const assignedTeamName = assignedTeamByUser[user.id]

            return (
              <Card key={user.id}>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm'>{user.name}</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <p className='text-muted-foreground text-xs'>Recommended by skill match</p>

                  {teams.length > 0 ? (
                    <Popover
                      open={openUserId === user.id}
                      onOpenChange={(open) => setOpenUserId(open ? user.id : null)}
                    >
                      <PopoverTrigger asChild>
                        <Button size='sm' variant='outline'>
                          Add to team
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className='w-64'>
                        <PopoverHeader>
                          <PopoverTitle>Add candidate</PopoverTitle>
                          <PopoverDescription>Select a team for this candidate.</PopoverDescription>
                        </PopoverHeader>

                        <div className='mt-3 flex flex-col gap-2'>
                          {teams.map((team) => {
                            const key = `${user.id}:${team.id}`
                            const isPending = assigningKey === key

                            return (
                              <Button
                                key={team.id}
                                type='button'
                                variant='secondary'
                                onClick={() => handleAssign(user.id, team)}
                                disabled={Boolean(assigningKey)}
                              >
                                {isPending ? 'Adding...' : `Add to ${team.name}`}
                              </Button>
                            )
                          })}
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <p className='text-muted-foreground text-xs'>Create a team in this project before assigning candidates.</p>
                  )}

                  {assignedTeamName ? <p className='text-emerald-600 text-xs'>Added to {assignedTeamName}.</p> : null}
                  {assignError ? <p className='text-destructive text-xs'>{assignError}</p> : null}
                </CardContent>
              </Card>
            )
          })
        ) : (
          <p className='text-muted-foreground text-sm'>No recommendations available.</p>
        )}
      </div>
    </div>
  )
}
