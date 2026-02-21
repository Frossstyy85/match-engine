import Link from 'next/link'
import { notFound } from 'next/navigation'

import EditProjectForm from '@/features/projects/components/edit-project-form'
import { fetchProject } from '@/features/projects/data/projects-repository'
import { fetchSkillsWithCategories } from '@/features/skills/data/skills-repository'

export default async function EditProjectScreen({ projectId }) {
  const [project, skills] = await Promise.all([fetchProject(projectId), fetchSkillsWithCategories()])

  if (!project) notFound()

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='flex w-full max-w-xl min-w-0 flex-col gap-4 overflow-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
        <Link href={`/dashboard/projects/${projectId}`} className='text-sm text-blue-600 hover:underline'>
          Back to projects
        </Link>

        <EditProjectForm
          project={project}
          skills={skills}
          projectSkills={project.projectSkills}
          teams={project.teams}
        />
      </div>
    </div>
  )
}
