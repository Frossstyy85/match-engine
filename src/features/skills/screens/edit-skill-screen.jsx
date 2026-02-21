import Link from 'next/link'
import { notFound } from 'next/navigation'

import { fetchSkill } from '@/features/skills/data/skills-repository'

export default async function EditSkillScreen({ skillId }) {
  const skill = await fetchSkill(skillId)
  if (!skill) notFound()

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='flex w-full max-w-xl min-w-0 flex-col gap-4 overflow-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
        <Link href='/dashboard/skills' className='text-sm text-blue-600 hover:underline'>
          Back to skills
        </Link>
        <h1 className='text-lg font-semibold'>Edit skill</h1>
        <p className='text-sm text-muted-foreground'>
          {skill.name}
          {skill.skillCategory ? ` · ${skill.skillCategory.name}` : ''}
        </p>
      </div>
    </div>
  )
}
