'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ARNAQUE_TYPES } from '@/lib/utils'
import type { Report } from '@/types'

export function ValidateReportButton({ report }: { report: Report }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Formulaire pré-rempli
  const [facebookFirstName, setFacebookFirstName] = useState(report.facebook_first_name ?? '')
  const [facebookLastName, setFacebookLastName] = useState(report.facebook_last_name ?? '')
  const [facebookUrl, setFacebookUrl] = useState(report.facebook_url ?? '')
  const [wewardPseudos, setWewardPseudos] = useState(report.weward_pseudos.join(', '))
  const [arnaqueType, setArnaqueType] = useState(report.arnaque_type ?? '')
  const [description, setDescription] = useState(report.description ?? '')
  const [status, setStatus] = useState<'suspected' | 'confirmed'>('confirmed')

  async function handleValidate() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const pseudos = wewardPseudos.split(',').map(p => p.trim()).filter(Boolean)

    const { data: thief } = await supabase.from('thieves').insert({
      facebook_first_name: facebookFirstName || null,
      facebook_last_name: facebookLastName || null,
      facebook_url: facebookUrl || null,
      weward_pseudos: pseudos,
      arnaque_type: arnaqueType || null,
      description: description || null,
      infraction_urls: report.infraction_urls,
      status,
      created_by: user.id,
    }).select().single()

    await supabase.from('reports').update({
      status: 'approved',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      thief_id: thief?.id,
    }).eq('id', report.id)

    router.refresh()
  }

  return (
    <div className="flex-1">
      <Button
        size="sm"
        onClick={() => setOpen(!open)}
        className="w-full"
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Valider
        {open ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
      </Button>

      {open && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md space-y-3">
          <p className="text-xs font-medium text-green-800">Vérifier et confirmer les données :</p>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Prénom</Label>
              <Input className="h-8 text-sm" value={facebookFirstName} onChange={e => setFacebookFirstName(e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Nom</Label>
              <Input className="h-8 text-sm" value={facebookLastName} onChange={e => setFacebookLastName(e.target.value)} />
            </div>
          </div>

          <div>
            <Label className="text-xs">URL Facebook</Label>
            <Input className="h-8 text-sm" value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} />
          </div>

          <div>
            <Label className="text-xs">Pseudos Weward (séparés par virgule)</Label>
            <Input className="h-8 text-sm" value={wewardPseudos} onChange={e => setWewardPseudos(e.target.value)} />
          </div>

          <div>
            <Label className="text-xs">Type d&apos;arnaque</Label>
            <select
              value={arnaqueType}
              onChange={e => setArnaqueType(e.target.value)}
              className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionner...</option>
              {ARNAQUE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <Label className="text-xs">Description</Label>
            <Textarea className="text-sm" rows={2} value={description} onChange={e => setDescription(e.target.value)} />
          </div>

          <div>
            <Label className="text-xs">Statut</Label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as 'suspected' | 'confirmed')}
              className="h-8 w-full rounded-md border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="confirmed">Confirmé</option>
              <option value="suspected">Suspecté</option>
            </select>
          </div>

          <Button size="sm" onClick={handleValidate} disabled={loading} className="w-full">
            {loading ? 'Validation...' : 'Confirmer la validation'}
          </Button>
        </div>
      )}
    </div>
  )
}
