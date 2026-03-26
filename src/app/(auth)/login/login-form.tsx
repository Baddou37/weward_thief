'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/use-translations'
import { AppSettingsMenu } from '@/components/app-settings-menu'

function queryErrorMessage(
  searchParams: { get: (name: string) => string | null },
  t: (key: string) => string,
): string {
  const err = searchParams.get('error')
  if (err === 'session') {
    const base = t('login.errorSession')
    const reason = searchParams.get('reason')
    if (reason && process.env.NODE_ENV === 'development') {
      try {
        return `${base} ${t('login.errorSessionDev')} ${decodeURIComponent(reason)}`
      } catch {
        return `${base} ${t('login.errorSessionDev')} ${reason}`
      }
    }
    return base
  }
  return ''
}

export function LoginForm() {
  const searchParams = useSearchParams()
  const t = useTranslations()
  const urlError = useMemo(
    () => queryErrorMessage(searchParams, t),
    [searchParams, t],
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const displayError = error || urlError

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(t('login.wrongCredentials'))
      setLoading(false)
      return
    }

    window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 relative dark:bg-gray-950">
      <div className="fixed top-4 right-4 z-50">
        <AppSettingsMenu />
      </div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('common.appName')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('login.subtitle')}</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">{t('login.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="email">{t('login.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.placeholderEmail')}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">{t('login.password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('login.placeholderPassword')}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-0 flex h-10 items-center justify-center px-3 text-gray-500 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-r-md dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={
                      showPassword ? t('login.hidePassword') : t('login.showPassword')
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
              {displayError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 dark:bg-red-950/40 dark:border-red-900 dark:text-red-400">
                  {displayError}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('login.submitting') : t('login.submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
