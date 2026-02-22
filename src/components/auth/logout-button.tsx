'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { supabase } from '@/lib/supabase/client'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return <Button onClick={handleLogout}>Logout</Button>
}
