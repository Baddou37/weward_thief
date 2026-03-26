'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getArnaqueTypeOptions, nativeSelectClassName } from '@/lib/utils'
import { Plus, X } from 'lucide-react'
import type { Thief } from '@/types'
import { useLocale } from '@/components/locale-provider'
import { useTranslations } from '@/lib/i18n/use-translations'
import { interpolate } from '@/lib/i18n/dictionaries'

export function EditThiefForm({ thief }: { thief: Thief }) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const arnaqueOptions = getArnaqueTypeOptions(locale)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [facebookFirstName, setFacebookFirstName] = useState(thief.facebook_first_name ?? '')
  const [facebookLastName, setFacebookLastName] = useState(thief.facebook_last_name ?? '')
  const [facebookUrl, setFacebookUrl] = useState(thief.facebook_url ?? '')
  const [wewardPseudos, setWewardPseudos] = useState<string[]>(thief.weward_pseudos.length > 0 ? thief.weward_pseudos : [''])
  const [arnaqueType, setArnaqueType] = useState(thief.arnaque_type ?? '')
  const [description, setDescription] = useState(thief.description ?? '')
  const [infractionUrls, setInfractionUrls] = useState<string[]>(thief.infraction_urls.length > 0 ? thief.infraction_urls : [''])
  const [status, setStatus] = useState<'suspected' | 'confirmed'>(thief.status)

  function addPseudo() { setWewardPseudos([...wewardPseudos, '']) }
  function removePseudo(i: number) { setWewardPseudos(wewardPseudos.filter((_, idx) => idx !== i)) }
  function updatePseudo(i: number, val: string) { const u = [...wewardPseudos]; u[i] = val; setWewardPseudos(u) }

  function addUrl() { setInfractionUrls([...infractionUrls, '']) }
  function removeUrl(i: number) { setInfractionUrls(infractionUrls.filter((_, idx) => idx !== i)) }
  function updateUrl(i: number, val: string) { const u = [...infractionUrls]; u[i] = val; setInfractionUrls(u) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { error: updateError } = await supabase.from('thieves').update({
      facebook_first_name: facebookFirstName || null,
      facebook_last_name: facebookLastName || null,
      facebook_url: facebookUrl || null,
      weward_pseudos: wewardPseudos.filter(p => p.trim()),
      arnaque_type: arnaqueType || null,
      description: description || null,
      infraction_urls: infractionUrls.filter(u => u.trim()),
      status,
      updated_by: user?.id,
    }).eq('id', thief.id)

    if (updateError) {
      setError(t('editThief.updateError'))
      setLoading(false)
      return
    }

    router.push(`/voleurs/${thief.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      <div className="space-y-1">
        <Label>{t('editThief.status')}</Label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value as 'suspected' | 'confirmed')}
          className={nativeSelectClassName}
        >
          <option value="confirmed">{t('editThief.statusConfirmed')}</option>
          <option value="suspected">{t('editThief.statusSuspected')}</option>
        </select>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('editThief.fbIdentity')}</legend>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="firstName">{t('editThief.firstName')}</Label>
            <Input id="firstName" value={facebookFirstName} onChange={e => setFacebookFirstName(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">{t('editThief.lastName')}</Label>
            <Input id="lastName" value={facebookLastName} onChange={e => setFacebookLastName(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="fbUrl">{t('editThief.fbUrl')}</Label>
          <Input id="fbUrl" type="url" value={facebookUrl} onChange={e => setFacebookUrl(e.target.value)} />
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label>{t('editThief.pseudos')}</Label>
        {wewardPseudos.map((pseudo, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={pseudo}
              onChange={e => updatePseudo(i, e.target.value)}
              placeholder={interpolate(t('editThief.pseudoN'), { n: i + 1 })}
            />
            {wewardPseudos.length > 1 && (
              <button type="button" onClick={() => removePseudo(i)} className="text-gray-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addPseudo} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          <Plus className="h-3 w-3" />
          {t('editThief.addPseudo')}
        </button>
      </div>

      <div className="space-y-1">
        <Label>{t('editThief.scamType')}</Label>
        <select
          value={arnaqueType}
          onChange={e => setArnaqueType(e.target.value)}
          className={nativeSelectClassName}
        >
          <option value="">{t('editThief.select')}</option>
          {arnaqueOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      <div className="space-y-1">
        <Label>{t('editThief.description')}</Label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
      </div>

      <div className="space-y-2">
        <Label>{t('editThief.proofLinks')}</Label>
        {infractionUrls.map((url, i) => (
          <div key={i} className="flex gap-2">
            <Input type="url" value={url} onChange={e => updateUrl(i, e.target.value)} placeholder="https://..." />
            {infractionUrls.length > 1 && (
              <button type="button" onClick={() => removeUrl(i)} className="text-gray-400 hover:text-red-500">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addUrl} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          <Plus className="h-3 w-3" />
          {t('editThief.addLink')}
        </button>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400 rounded-md p-3">{error}</p>}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? t('editThief.saving') : t('editThief.save')}
      </Button>
    </form>
  )
}
