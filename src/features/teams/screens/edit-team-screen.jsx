import Link from 'next/link'
import { notFound } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import EditTeamForm from '@/features/teams/components/edit-team-form'
import { fetchTeam } from '@/features/teams/data/teams-repository'

export default async function EditTeamScreen({ teamId }) {
  const team = await fetchTeam(teamId)
  if (!team) notFound()

  const supabase = await createClient()
  const { data: profiles } = await supabase.from('profiles').select('id, name, email, team_id')

  return (
    <div className='w-full min-w-0 p-3 sm:p-4'>
      <div className='flex w-full min-w-0 flex-col gap-4 overflow-auto rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6'>
        <div className='flex w-full items-center justify-between'>
          <Link href={`/dashboard/teams/${teamId}`} className='text-sm text-blue-600 hover:underline'>
            Back to team
          </Link>
        </div>
        <EditTeamForm team={team} profiles={profiles ?? []} />
      </div>
    </div>
  )
}
