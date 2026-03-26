'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/use-translations'

export function DeleteThiefButton({ thiefId }: { thiefId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations()

  async function handleDelete() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('thieves').delete().eq('id', thiefId)
    router.push('/dashboard')
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">{t('deleteThief.confirm')}</span>
        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
          {loading ? t('deleteThief.deleting') : t('deleteThief.yes')}
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          {t('deleteThief.cancel')}
        </Button>
      </div>
    )
  }

  return (
    <Button variant="destructive" onClick={() => setConfirming(true)}>
      <Trash2 className="h-4 w-4 mr-1" />
      {t('deleteThief.delete')}
    </Button>
  )
}
