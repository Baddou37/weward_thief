'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { getArnaqueTypeOptions, nativeSelectClassName } from '@/lib/utils'
import { Plus, X, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useLocale } from '@/components/locale-provider'
import { useTranslations } from '@/lib/i18n/use-translations'
import { interpolate } from '@/lib/i18n/dictionaries'

export default function NouveauSignalementPage() {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const arnaqueOptions = getArnaqueTypeOptions(locale)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [facebookFirstName, setFacebookFirstName] = useState('')
  const [facebookLastName, setFacebookLastName] = useState('')
  const [facebookUrl, setFacebookUrl] = useState('')
  const [wewardPseudos, setWewardPseudos] = useState<string[]>([''])
  const [arnaqueType, setArnaqueType] = useState('')
  const [description, setDescription] = useState('')
  const [infractionUrls, setInfractionUrls] = useState<string[]>([''])

  function addPseudo() { setWewardPseudos([...wewardPseudos, '']) }
  function removePseudo(i: number) { setWewardPseudos(wewardPseudos.filter((_, idx) => idx !== i)) }
  function updatePseudo(i: number, val: string) {
    const updated = [...wewardPseudos]
    updated[i] = val
    setWewardPseudos(updated)
  }

  function addUrl() { setInfractionUrls([...infractionUrls, '']) }
  function removeUrl(i: number) { setInfractionUrls(infractionUrls.filter((_, idx) => idx !== i)) }
  function updateUrl(i: number, val: string) {
    const updated = [...infractionUrls]
    updated[i] = val
    setInfractionUrls(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setError(t('reportNew.sessionExpired'))
      setLoading(false)
      return
    }

    const { error: insertError } = await supabase.from('reports').insert({
      facebook_first_name: facebookFirstName || null,
      facebook_last_name: facebookLastName || null,
      facebook_url: facebookUrl || null,
      weward_pseudos: wewardPseudos.filter(p => p.trim()),
      arnaque_type: arnaqueType || null,
      description: description || null,
      infraction_urls: infractionUrls.filter(u => u.trim()),
      submitted_by: user.id,
    })

    if (insertError) {
      setError(t('reportNew.submitError'))
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="p-4 lg:p-6 max-w-lg mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('reportNew.successTitle')}</h2>
          <p className="text-gray-500 mb-6">
            {t('reportNew.successBody')}
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push('/dashboard')}>{t('reportNew.backToDashboard')}</Button>
            <Button variant="outline" onClick={() => {
              setSuccess(false)
              setFacebookFirstName('')
              setFacebookLastName('')
              setFacebookUrl('')
              setWewardPseudos([''])
              setArnaqueType('')
              setDescription('')
              setInfractionUrls([''])
            }}>
              {t('reportNew.another')}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-lg mx-auto">
      <div className="mb-4">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200">
          <ArrowLeft className="h-4 w-4" />
          {t('reportNew.back')}
        </Link>
      </div>

      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('reportNew.title')}</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('reportNew.fbIdentity')}</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName">{t('reportNew.firstName')}</Label>
              <Input
                id="firstName"
                value={facebookFirstName}
                onChange={(e) => setFacebookFirstName(e.target.value)}
                placeholder={t('reportNew.placeholders.first')}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">{t('reportNew.lastName')}</Label>
              <Input
                id="lastName"
                value={facebookLastName}
                onChange={(e) => setFacebookLastName(e.target.value)}
                placeholder={t('reportNew.placeholders.last')}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="fbUrl">{t('reportNew.fbUrl')}</Label>
            <Input
              id="fbUrl"
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder={t('reportNew.fbPlaceholder')}
            />
          </div>
        </fieldset>

        <div className="space-y-2">
          <Label>{t('reportNew.pseudos')}</Label>
          {wewardPseudos.map((pseudo, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={pseudo}
                onChange={(e) => updatePseudo(i, e.target.value)}
                placeholder={interpolate(t('reportNew.pseudoN'), { n: i + 1 })}
                required={i === 0}
              />
              {wewardPseudos.length > 1 && (
                <button type="button" onClick={() => removePseudo(i)} className="text-gray-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPseudo}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            {t('reportNew.addPseudo')}
          </button>
        </div>

        <div className="space-y-1">
          <Label htmlFor="arnaqueType">{t('reportNew.scamType')}</Label>
          <select
            id="arnaqueType"
            value={arnaqueType}
            onChange={(e) => setArnaqueType(e.target.value)}
            className={nativeSelectClassName}
          >
            <option value="">{t('reportNew.select')}</option>
            {arnaqueOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="description">{t('reportNew.description')}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('reportNew.descPlaceholder')}
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label>{t('reportNew.proofLinks')}</Label>
          {infractionUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <Input
                type="url"
                value={url}
                onChange={(e) => updateUrl(i, e.target.value)}
                placeholder="https://..."
              />
              {infractionUrls.length > 1 && (
                <button type="button" onClick={() => removeUrl(i)} className="text-gray-400 hover:text-red-500">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addUrl}
            className="text-sm text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            {t('reportNew.addLink')}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? t('reportNew.sending') : t('reportNew.submit')}
        </Button>
      </form>
    </div>
  )
}
