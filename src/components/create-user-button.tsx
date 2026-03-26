'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, X, CheckCircle } from 'lucide-react'

export function CreateUserButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const router = useRouter()

  function reset() {
    setEmail('')
    setDisplayName('')
    setRole('user')
    setLang('fr')
    setError('')
    setSuccess(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, display_name: displayName, role, lang }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? 'Erreur lors de la création')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
    router.refresh()
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <UserPlus className="h-4 w-4 mr-1" />
        Nouvel utilisateur
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Nouvel utilisateur</h2>
          <button onClick={() => { setOpen(false); reset() }} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
            <p className="font-medium text-gray-900">Invitation envoyée !</p>
            <p className="text-sm text-gray-500">
              Un email a été envoyé à <strong>{email}</strong>.<br />
              L&apos;utilisateur devra cliquer sur le lien pour choisir son mot de passe.
            </p>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => { reset() }}>
                Inviter un autre
              </Button>
              <Button variant="outline" onClick={() => { setOpen(false); reset() }}>
                Fermer
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="displayName">Nom affiché</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jean@email.com"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="role">Rôle</Label>
                <select
                  id="role"
                  value={role}
                  onChange={e => setRole(e.target.value as 'user' | 'admin')}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="lang">Langue de l&apos;email</Label>
                <select
                  id="lang"
                  value={lang}
                  onChange={e => setLang(e.target.value as 'fr' | 'en')}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="fr">🇫🇷 Français</option>
                  <option value="en">🇬🇧 English</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Un email d&apos;invitation sera envoyé via Resend. L&apos;utilisateur choisira son mot de passe en cliquant sur le lien.
            </p>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>}

            <div className="flex gap-2 pt-1">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setOpen(false); reset() }}>
                Annuler
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
