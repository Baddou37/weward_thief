'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { nativeSelectClassName } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UserPlus, X, CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/use-translations'

export function CreateUserButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showPw2, setShowPw2] = useState(false)
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const router = useRouter()
  const t = useTranslations()

  function reset() {
    setEmail('')
    setDisplayName('')
    setPassword('')
    setPasswordConfirm('')
    setLang('fr')
    setError('')
    setSuccess(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== passwordConfirm) {
      setError(t('createUser.pwdMismatch'))
      setLoading(false)
      return
    }
    if (password.length < 8) {
      setError(t('createUser.pwdShort'))
      setLoading(false)
      return
    }

    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        display_name: displayName,
        password,
        role: 'admin',
        lang,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error ?? t('createUser.genericError'))
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
        {t('createUser.button')}
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6 w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">{t('createUser.title')}</h2>
          <button onClick={() => { setOpen(false); reset() }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-4 space-y-3">
            <CheckCircle className="h-10 w-10 text-green-500 mx-auto" />
            <p className="font-medium text-gray-900">{t('createUser.successTitle')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('createUser.successBodyPrefix')}{' '}
              <strong>{email}</strong>
              {'. '}
              {t('createUser.successBodySuffix')}
            </p>
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={() => { reset() }}>
                {t('createUser.createAnother')}
              </Button>
              <Button variant="outline" onClick={() => { setOpen(false); reset() }}>
                {t('createUser.close')}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="displayName">{t('createUser.displayName')}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Jean Dupont"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">{t('createUser.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jean@email.com"
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">{t('createUser.initialPassword')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('createUser.minChars')}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-0 top-0 flex h-10 items-center justify-center px-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPw ? t('createUser.hide') : t('createUser.show')}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="passwordConfirm">{t('createUser.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type={showPw2 ? 'text' : 'password'}
                  value={passwordConfirm}
                  onChange={e => setPasswordConfirm(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw2(v => !v)}
                  className="absolute right-0 top-0 flex h-10 items-center justify-center px-3 text-gray-500 hover:text-gray-700"
                  aria-label={showPw2 ? t('createUser.hide') : t('createUser.show')}
                >
                  {showPw2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="lang">{t('createUser.emailLang')}</Label>
              <select
                id="lang"
                value={lang}
                onChange={e => setLang(e.target.value as 'fr' | 'en')}
                className={nativeSelectClassName}
              >
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇬🇧 English</option>
              </select>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('createUser.hint')}
            </p>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400 rounded p-2">{error}</p>}

            <div className="flex gap-2 pt-1">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? t('createUser.creating') : t('createUser.create')}
              </Button>
              <Button type="button" variant="outline" onClick={() => { setOpen(false); reset() }}>
                {t('createUser.cancel')}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
