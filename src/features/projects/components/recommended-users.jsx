'use client'

import { useQuery } from '@tanstack/react-query'
import { Card } from '@/components/ui/card'
import { supabase } from '@/lib/supabase/client'

async function fetchRecommendedUsers(projectId) {
  const { data, error } = await supabase.rpc('get_recommended_users', {
    p_project_id: projectId,
    p_limit: 5
  })

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.profile_id,
    name: row.profile_name ?? 'Unnamed user'
  }))
}

export default function RecommendedUsers({ projectId }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['recommendedUsers', projectId],
    queryFn: () => fetchRecommendedUsers(projectId)
  })

  if (isLoading) return <p>loading...</p>
  if (error) return <p className='text-sm text-red-600'>Failed to load recommendations.</p>

  return (
    <div>
      <p>Top candidates</p>
      <div className='flex gap-4'>
        {(data ?? []).map((user) => (
          <Card className='h-45 w-45' key={user.id}>
            {user.name}
          </Card>
        ))}
      </div>
    </div>
  )
}
