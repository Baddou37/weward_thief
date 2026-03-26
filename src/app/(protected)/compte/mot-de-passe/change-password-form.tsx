'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/use-translations'

export function ChangePasswordForm() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const t = useTranslations()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) {
      setError(t('account.pwdMismatch'))
      return
    }
    if (password.length < 8) {
      setError(t('account.pwdShort'))
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) {
      setError(err.message)
      return
    }
    setDone(true)
    setPassword('')
    setConfirm('')
  }

  if (done) {
    return (
      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md p-3">
        {t('account.success')}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="new-password">{t('account.newPassword')}</Label>
        <div className="relative">
          <Input
            id="new-password"
            type={showPassword ? 'text' : 'password'}
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
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-0 top-0 flex h-10 items-center justify-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-r-md"
            aria-label={
              showPassword ? t('account.hidePassword') : t('account.showPassword')
            }
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="confirm-new">{t('account.confirmPassword')}</Label>
        <div className="relative">
          <Input
            id="confirm-new"
            type={showConfirm ? 'text' : 'password'}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="••••••••"
            required
            minLength={8}
            autoComplete="new-password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(v => !v)}
            className="absolute right-0 top-0 flex h-10 items-center justify-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-r-md"
            aria-label={
              showConfirm
                ? t('account.hideConfirm')
                : t('account.showConfirm')
            }
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400 rounded-md p-3">
          {error}
        </p>
      )}
      <Button type="submit" disabled={loading}>
        {loading ? t('account.saving') : t('account.save')}
      </Button>
    </form>
  )
}
