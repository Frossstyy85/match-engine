'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createSkill(name, categoryId) {
  if (!name.trim()) throw new Error('Skill name is required')

  const supabase = await createClient()
  const { error } = await supabase.from('skills').insert({
    name: name.trim(),
    category_id: categoryId
  })

  if (error) throw error
  revalidatePath('/dashboard/skills')
}

export async function deleteSkill(skillId) {
  const supabase = await createClient()
  const { error } = await supabase.from('skills').delete().eq('id', skillId)

  if (error) throw error
  revalidatePath('/dashboard/skills')
}
