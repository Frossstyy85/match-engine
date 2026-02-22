'use client'

import Link from 'next/link'
import { ArrowLeftIcon, Edit3Icon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getProjectById as fetchProject } from '@/lib/db/projects'
import { getSkillsWithCategory as fetchSkillsWithCategories } from '@/lib/db/skills'
import EditProjectForm from '@/features/projects/components/edit-project-form'

export default function EditProjectPage({ projectId }) {
  const projectQuery = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId)
  })

  const skillsQuery = useQuery({
    queryKey: ['skills-with-categories'],
    queryFn: fetchSkillsWithCategories
  })

  if (projectQuery.isLoading || skillsQuery.isLoading) {
    return <p className='text-muted-foreground text-sm'>Loading project...</p>
  }

  if (projectQuery.error || skillsQuery.error || !projectQuery.data) {
    return <p className='text-destructive text-sm'>Failed to load project.</p>
  }

  const project = projectQuery.data
  const skills = skillsQuery.data ?? []

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='mx-auto flex w-full min-w-0 max-w-5xl flex-col gap-3'>
        <header className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0 space-y-1'>
            <h1 className='inline-flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl'>
              <Edit3Icon className='text-muted-foreground size-4.5' />
              <span className='truncate'>Edit project</span>
            </h1>
            <p className='text-muted-foreground text-sm'>{project.name}</p>
          </div>
          <div className='flex flex-wrap items-center gap-2'>
            <Button asChild size='sm' variant='ghost'>
              <Link href={`/dashboard/projects/${projectId}`}>
                <ArrowLeftIcon />
                Back
              </Link>
            </Button>
          </div>
        </header>

        <Card className='w-full max-w-4xl border-border shadow-sm'>
          <CardContent className='space-y-3 p-5'>
            <EditProjectForm
              project={project}
              skills={skills}
              projectSkills={project.projectSkills}
              teams={project.teams}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
