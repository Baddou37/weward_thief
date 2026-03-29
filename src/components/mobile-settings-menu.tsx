'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AppSettingsMenu } from '@/components/app-settings-menu'

export function MobileSettingsMenu() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return <AppSettingsMenu onLogout={handleLogout} />
}
