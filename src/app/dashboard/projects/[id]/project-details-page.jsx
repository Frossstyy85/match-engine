'use client'

import Link from 'next/link'
import { Edit3Icon, FolderKanbanIcon, ListIcon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { getProjectById as fetchProject } from '@/lib/db/projects'
import { formatDate } from '@/lib/helpers/date'
import RecommendedUsers from '@/app/dashboard/projects/components/recommended-users'
import { DeleteProjectButton } from '@/app/dashboard/projects/components/delete-project-button'

export default function ProjectDetailsPage({ projectId }) {
  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId)
  })

  if (isLoading) {
    return <p className='text-muted-foreground text-sm'>Loading project...</p>
  }

  if (error || !project) {
    return <p className='text-destructive text-sm'>Failed to load project.</p>
  }

  const teamsNode =
    project.teams.length !== 0 ? (
      <div className='flex flex-col items-start gap-1'>
        {project.teams.map((team) => (
          <Button asChild key={team.id} variant='link' className='h-auto p-0'>
            <Link href={`/dashboard/teams/${team.id}`}>{team.name}</Link>
          </Button>
        ))}
      </div>
    ) : (
      <p className='text-muted-foreground text-sm'>No teams found.</p>
    )

  const skillsNode =
    project.projectSkills.length !== 0 ? (
      <ul className='list-disc space-y-1 pl-4'>
        {project.projectSkills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    ) : (
      <p className='text-muted-foreground text-sm'>No required skills found.</p>
    )

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-3'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <FolderKanbanIcon className='text-muted-foreground size-4.5' />
              <span className='truncate'>{project.name}</span>
            </h1>
            <p className='text-muted-foreground text-sm'>{`Project ID: ${project.id}`}</p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Button asChild size='sm' variant='default'>
              <Link href={`/dashboard/projects/${project.id}/edit`}>
                <Edit3Icon />
                Edit
              </Link>
            </Button>
            <Button asChild size='sm' variant='ghost'>
              <Link href='/dashboard/projects'>
                <ListIcon />
                All projects
              </Link>
            </Button>
            <DeleteProjectButton projectId={project.id} projectName={project.name} />
          </div>
        </header>

        <Card className='w-full max-w-4xl border-border shadow-sm'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-base'>Project details</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <FieldGroup>
              <Field>
                <FieldTitle>Project name</FieldTitle>
                <div>{project.name}</div>
              </Field>

              <Field>
                <FieldTitle>Project ID</FieldTitle>
                <div>{project.id}</div>
              </Field>

              <FieldGroup className='grid gap-3 sm:grid-cols-2'>
                <Field>
                  <FieldTitle>Start date</FieldTitle>
                  <div>{formatDate(project.startDate)}</div>
                </Field>
                <Field>
                  <FieldTitle>End date</FieldTitle>
                  <div>{formatDate(project.endDate)}</div>
                </Field>
              </FieldGroup>

              <Field>
                <FieldTitle>Teams</FieldTitle>
                {teamsNode}
              </Field>

              <Field>
                <FieldTitle>Required skills</FieldTitle>
                {skillsNode}
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card className='w-full max-w-4xl border-border shadow-sm'>
          <CardHeader className='gap-1'>
            <CardTitle className='text-base'>Recommendations</CardTitle>
            <CardDescription>Suggested profiles ranked by project requirements.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-3'>
            <RecommendedUsers projectId={project.id} teams={project.teams} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
