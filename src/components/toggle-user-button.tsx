'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function ToggleUserButton({
  userId,
  isActive,
  isSelf,
}: {
  userId: string
  isActive: boolean
  isSelf: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handle() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ is_active: !isActive }).eq('id', userId)
    router.refresh()
    setLoading(false)
  }

  if (isSelf) return null

  return (
    <Button
      variant={isActive ? 'outline' : 'secondary'}
      size="sm"
      onClick={handle}
      disabled={loading}
    >
      {isActive ? 'Désactiver' : 'Réactiver'}
    </Button>
  )
}
