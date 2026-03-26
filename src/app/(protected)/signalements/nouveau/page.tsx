'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ARNAQUE_TYPES } from '@/lib/utils'
import { Plus, X, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function NouveauSignalementPage() {
  const router = useRouter()
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
      setError('Session expirée. Veuillez vous reconnecter.')
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
      setError('Erreur lors de la soumission. Veuillez réessayer.')
      setLoading(false)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="p-4 lg:p-6 max-w-lg mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Signalement soumis !</h2>
          <p className="text-gray-500 mb-6">
            Votre signalement a été envoyé et sera examiné par un administrateur.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => router.push('/dashboard')}>Retour au tableau de bord</Button>
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
              Soumettre un autre signalement
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-lg mx-auto">
      <div className="mb-4">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>
      </div>

      <h1 className="text-xl font-bold text-gray-900 mb-6">Nouveau signalement</h1>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        {/* Identité Facebook */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-gray-700">Identité Facebook</legend>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={facebookFirstName}
                onChange={(e) => setFacebookFirstName(e.target.value)}
                placeholder="Jean"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={facebookLastName}
                onChange={(e) => setFacebookLastName(e.target.value)}
                placeholder="Dupont"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="fbUrl">Lien profil Facebook</Label>
            <Input
              id="fbUrl"
              type="url"
              value={facebookUrl}
              onChange={(e) => setFacebookUrl(e.target.value)}
              placeholder="https://facebook.com/..."
            />
          </div>
        </fieldset>

        {/* Pseudos Weward */}
        <div className="space-y-2">
          <Label>Pseudo(s) Weward *</Label>
          {wewardPseudos.map((pseudo, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={pseudo}
                onChange={(e) => updatePseudo(i, e.target.value)}
                placeholder={`Pseudo ${i + 1}`}
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
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Ajouter un pseudo
          </button>
        </div>

        {/* Type d'arnaque */}
        <div className="space-y-1">
          <Label htmlFor="arnaqueType">Type d&apos;arnaque</Label>
          <select
            id="arnaqueType"
            value={arnaqueType}
            onChange={(e) => setArnaqueType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner...</option>
            {ARNAQUE_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label htmlFor="description">Description de l&apos;arnaque</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez ce qui s'est passé..."
            rows={4}
          />
        </div>

        {/* Liens preuves */}
        <div className="space-y-2">
          <Label>Liens vers les preuves</Label>
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
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Ajouter un lien
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Soumettre le signalement'}
        </Button>
      </form>
    </div>
  )
}
