'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SquareArrowOutUpRight } from 'lucide-react'

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

function getScoreColor(percent) {
  if (percent >= 70) return { bar: 'bg-emerald-500', ring: 'stroke-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-500/10' }
  if (percent >= 50) return { bar: 'bg-amber-500', ring: 'stroke-amber-500', text: 'text-amber-600', bg: 'bg-amber-500/10' }
  return { bar: 'bg-rose-500', ring: 'stroke-rose-500', text: 'text-rose-600', bg: 'bg-rose-500/10' }
}

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
    setAssignErrorByUser((prev) => ({ ...prev, [userId]: null }))

    try {
      await assignMemberToTeam(userId, team.id)
      setAssignedTeamByUser((prev) => ({ ...prev, [userId]: team.name }))
      setOpenUserId(null)

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['project', projectId] }),
        queryClient.invalidateQueries({ queryKey: ['team-members', team.id] }),
        queryClient.invalidateQueries({ queryKey: ['team', team.id] }),
        queryClient.invalidateQueries({ queryKey: ['recommendedUsers', projectId] })
      ])
    } catch {
      setAssignErrorByUser((prev) => ({
        ...prev,
        [userId]: 'Failed to add this user to the selected team.'
      }))
    } finally {
      setAssigningKey(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <h3 className="text-foreground text-sm font-semibold tracking-tight">Top candidates</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-muted/50 border-border flex h-[180px] animate-pulse flex-col gap-3 rounded-2xl border p-5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-5 w-24 rounded-lg bg-muted" />
              <div className="h-14 w-14 rounded-full bg-muted" />
              <div className="h-4 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border-destructive/30 text-destructive rounded-xl border px-4 py-3 text-sm">
        Failed to load recommendations.
      </div>
    )
  }

  const users = data ?? []

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes recommended-card-in {
              0% { opacity: 0; transform: translateY(14px) scale(0.97); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes score-fill {
              from { stroke-dashoffset: 251.2; }
            }
            .recommended-card {
              animation: recommended-card-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
            }
          `
        }}
      />
      <div className="flex flex-col gap-4">
        <h3 className="text-foreground text-sm font-semibold tracking-tight">Top candidates</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.length > 0 ? (
            users.map((user, index) => {
              const assignError = assignErrorByUser[user.user_id]
              const assignedTeamName = assignedTeamByUser[user.user_id]
              const score = Number(user.match_score_percent) || 0
              const colors = getScoreColor(score)
              const circumference = 2 * Math.PI * 36
              const offset = circumference - (score / 100) * circumference

              return (
                <Card
                  key={user.user_id}
                  className="recommended-card border-border bg-card hover:border-primary/20 hover:shadow-md transition-all duration-300 overflow-hidden rounded-2xl border shadow-sm"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <CardHeader className="pb-2 pt-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <CardTitle className="text-foreground truncate text-base font-semibold">
                            {user.user_name}
                          </CardTitle>
                          <Link
                            href={`/dashboard/users/${user.user_id}`}
                            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                            aria-label={`Open ${user.user_name} profile`}
                          >
                            <SquareArrowOutUpRight className="size-4" />
                          </Link>
                        </div>
                        <p className="text-muted-foreground mt-0.5 text-xs">Skill match</p>
                      </div>
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                        <svg className="h-14 w-14 -rotate-90" viewBox="0 0 100 100">
                          <circle
                            className="stroke-muted"
                            cx="50"
                            cy="50"
                            r="36"
                            fill="none"
                            strokeWidth="8"
                          />
                          <circle
                            className={`${colors.ring} transition-[stroke-dashoffset] duration-700 ease-out`}
                            cx="50"
                            cy="50"
                            r="36"
                            fill="none"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            style={{ strokeDashoffset: offset }}
                          />
                        </svg>
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${colors.text}`}
                        >
                          {Math.round(score)}%
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pb-5">
                    <div className="space-y-3">
                      <div>
                        <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wider">Pros</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(user.matched_skills ?? []).length > 0 ? (
                            <>
                              {(user.matched_skills ?? []).slice(0, 2).map((skill, i) => (
                                <span
                                  key={skill.id ?? i}
                                  className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                                >
                                  Knows {skill.name ?? skill.skill_name ?? '—'}
                                </span>
                              ))}
                              {(user.matched_skills ?? []).length > 2 && (
                                <span className="text-muted-foreground text-xs">
                                  {(user.matched_skills ?? []).length - 2} more…
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wider">Cons</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(user.unmatched_skills ?? []).length > 0 ? (
                            <>
                              {(user.unmatched_skills ?? []).slice(0, 2).map((skill, i) => (
                                <span
                                  key={skill.id ?? i}
                                  className="bg-rose-500/15 text-rose-700 dark:text-rose-400 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium"
                                >
                                  Missing {skill.name ?? skill.skill_name ?? '—'}
                                </span>
                              ))}
                              {(user.unmatched_skills ?? []).length > 2 && (
                                <span className="text-muted-foreground text-xs">
                                  {(user.unmatched_skills ?? []).length - 2} more…
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground text-xs">None</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {teams.length > 0 ? (
                      <Popover
                        open={openUserId === user.user_id}
                        onOpenChange={(open) => setOpenUserId(open ? user.user_id : null)}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-colors"
                          >
                            Add to team
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 rounded-xl border shadow-lg">
                          <PopoverHeader>
                            <PopoverTitle>Add candidate</PopoverTitle>
                            <PopoverDescription>Select a team for this candidate.</PopoverDescription>
                          </PopoverHeader>
                          <div className="mt-3 flex flex-col gap-2">
                            {teams.map((team) => {
                              const key = `${user.user_id}:${team.id}`
                              const isPending = assigningKey === key
                              return (
                                <Button
                                  key={team.id}
                                  type="button"
                                  variant="secondary"
                                  onClick={() => handleAssign(user.user_id, team)}
                                  disabled={Boolean(assigningKey)}
                                  className="transition-opacity"
                                >
                                  {isPending ? 'Adding...' : `Add to ${team.name}`}
                                </Button>
                              )
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <p className="text-muted-foreground text-xs">
                        Create a team in this project before assigning candidates.
                      </p>
                    )}

                    {assignedTeamName && (
                      <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        Added to {assignedTeamName}.
                      </p>
                    )}
                    {assignError && (
                      <p className="text-destructive text-xs">{assignError}</p>
                    )}
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <div className="text-muted-foreground col-span-full rounded-2xl border border-dashed bg-muted/30 px-6 py-10 text-center text-sm">
              No recommendations available.
            </div>
          )}
        </div>
      </div>
    </>
  )
}
