'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from '@/lib/i18n/use-translations'

export function RejectReportButton({ reportId }: { reportId: string }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const t = useTranslations()

  async function handleReject() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase.from('reports').update({
      status: 'rejected',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      review_note: note || null,
    }).eq('id', reportId)

    router.refresh()
  }

  return (
    <div className="flex-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/40"
      >
        <XCircle className="h-4 w-4 mr-1" />
        {t('reject.reject')}
      </Button>

      {open && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md space-y-2 dark:bg-red-950/40 dark:border-red-900">
          <Textarea
            placeholder={t('reject.placeholder')}
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            className="text-sm"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={handleReject}
            disabled={loading}
            className="w-full"
          >
            {loading ? t('reject.rejecting') : t('reject.confirm')}
          </Button>
        </div>
      )}
    </div>
  )
}
