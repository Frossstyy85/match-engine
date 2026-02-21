import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Field, FieldGroup, FieldTitle } from '@/components/ui/field'
import { formatDate } from '@/lib/helpers/date'
import { fetchProject } from '@/features/projects/data/projects-repository'
import RecommendedUsers from '@/features/projects/components/recommended-users'
import { DeleteProjectButton } from '@/features/projects/components/delete-project-button'

export default async function ProjectDetailsScreen({ projectId }) {
  const project = await fetchProject(projectId)
  if (!project) notFound()

  const teamsNode =
    project.teams.length !== 0 ? (
      project.teams.map((team) => (
        <div key={team.id}>
          <Link href={`/dashboard/teams/${team.id}`} className='text-sm text-blue-600 hover:underline'>
            {team.name}
          </Link>
        </div>
      ))
    ) : (
      <p>No teams found</p>
    )

  const skillsNode =
    project.projectSkills.length !== 0 ? (
      project.projectSkills.map((skill) => <div key={skill}>{skill}</div>)
    ) : (
      <p>No skills found</p>
    )

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='flex w-full min-w-0 flex-col gap-4 overflow-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
        <div className='flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-xl font-semibold sm:text-2xl'>{project.name}</h1>
            <p className='text-sm text-gray-500'>ID: {project.id}</p>
          </div>

          <div className='flex flex-wrap gap-2 sm:gap-6'>
            <Link href={`/dashboard/projects/${project.id}/edit`} className='text-sm text-blue-600 hover:underline'>
              Edit project
            </Link>
            <Link href='/dashboard/projects' className='text-sm text-blue-600 hover:underline'>
              Back to projects
            </Link>
            <DeleteProjectButton projectId={project.id} projectName={project.name} />
          </div>
        </div>

        <div className='border-t border-gray-200 pt-4'>
          <FieldGroup>
            <Field>
              <FieldTitle>Project name</FieldTitle>
              <div>{project.name}</div>
            </Field>

            <Field>
              <FieldTitle>Project ID</FieldTitle>
              <div>{project.id}</div>
            </Field>

            <FieldGroup>
              <Field>
                <FieldTitle>Start date</FieldTitle>
                {formatDate(project.startDate)}
              </Field>
              <Field>
                <FieldTitle>End date</FieldTitle>
                {formatDate(project.endDate)}
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

          <RecommendedUsers projectId={project.id} />
        </div>
      </div>
    </div>
  )
}
