'use client'

import Link from 'next/link'
import { ArrowLeftIcon, Edit3Icon, UsersRoundIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { getProjectById as fetchProject } from '@/lib/db/projects'
import RecommendedUsers from '@/app/dashboard/projects/components/recommended-users'

export default function ProjectStaffingPage({ projectId }) {
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId)
  })

  if (isLoading) {
    return <p className='text-muted-foreground text-sm'>Loading staffing...</p>
  }

  if (error || !project) {
    return <p className='text-destructive text-sm'>Failed to load staffing data.</p>
  }

  const skills = project.projectSkills ?? []
  const teams = project.teams ?? []

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-3'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <UsersRoundIcon className='text-muted-foreground size-4.5' />
              <span className='truncate'>Project staffing</span>
            </h1>
            <p className='text-muted-foreground text-sm'>{project.name}</p>
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <Button asChild size='sm' variant='ghost'>
              <Link href={`/dashboard/projects/${project.id}`}>
                <ArrowLeftIcon />
                Back to project
              </Link>
            </Button>
            <Button asChild size='sm' variant='outline'>
              <Link href={`/dashboard/projects/${project.id}/edit`}>
                <Edit3Icon />
                Edit project
              </Link>
            </Button>
          </div>
        </header>

        <Card className='w-full max-w-4xl border-border shadow-sm'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-base'>Staffing context</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <FieldGroup className='grid gap-3 sm:grid-cols-2'>
              <Field>
                <FieldTitle>Linked teams</FieldTitle>
                {teams.length === 0 ? (
                  <p className='text-muted-foreground text-sm'>No teams linked yet.</p>
                ) : (
                  <div className='flex flex-wrap gap-1.5'>
                    {teams.map((team) => (
                      <Button key={team.id} asChild size='sm' variant='secondary' className='h-7 px-2.5 text-xs'>
                        <Link href={`/dashboard/teams/${team.id}`}>{team.name}</Link>
                      </Button>
                    ))}
                  </div>
                )}
              </Field>
              <Field>
                <FieldTitle>Required skills</FieldTitle>
                {skills.length === 0 ? (
                  <p className='text-muted-foreground text-sm'>No required skills yet.</p>
                ) : (
                  <div className='flex flex-wrap gap-1.5'>
                    {skills.map((skill) => (
                      <Badge key={skill} variant='outline'>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </Field>
            </FieldGroup>

            {teams.length === 0 ? (
              <p className='text-muted-foreground text-sm'>
                Create at least one team in this project before assigning recommended users.
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card className='w-full max-w-4xl border-border shadow-sm'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-base'>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <RecommendedUsers projectId={project.id} teams={teams} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
