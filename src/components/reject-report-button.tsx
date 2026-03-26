'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

export function RejectReportButton({ reportId }: { reportId: string }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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
        className="w-full text-red-600 border-red-200 hover:bg-red-50"
      >
        <XCircle className="h-4 w-4 mr-1" />
        Rejeter
      </Button>

      {open && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md space-y-2">
          <Textarea
            placeholder="Note pour le signalant (optionnel)..."
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
            {loading ? 'Rejet...' : 'Confirmer le rejet'}
          </Button>
        </div>
      )}
    </div>
  )
}
