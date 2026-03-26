'use client'

import { useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import {
  setPasswordAction,
  type SetPasswordState,
} from '@/app/auth/set-password/actions'

const initialState: SetPasswordState = {}

export function SetPasswordForm({ userEmail }: { userEmail: string }) {
  const [state, formAction, pending] = useActionState(
    setPasswordAction,
    initialState
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (state.success) {
      const t = setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
      return () => clearTimeout(t)
    }
  }, [state.success])

  if (state.success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="text-center space-y-3">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
          <p className="font-semibold text-gray-900">Mot de passe défini !</p>
          <p className="text-sm text-gray-500">
            Redirection vers le tableau de bord...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Wecard Thief</h1>
          <p className="text-sm text-gray-500 mt-1">Choisissez votre mot de passe</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Créer mon mot de passe</CardTitle>
            <p className="text-center text-sm text-gray-600 pt-1">
              Compte concerné :{' '}
              <span className="font-medium text-gray-900">{userEmail}</span>
            </p>
            <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md p-2 mt-2 text-left">
              Si ce n&apos;est pas l&apos;email de l&apos;invitation, vous aviez
              peut-être une autre session ouverte : déconnectez-vous partout ou
              ouvrez ce lien dans une fenêtre privée, puis recliquez sur le lien
              reçu par email.
            </p>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="8 caractères minimum"
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
                      showPassword
                        ? 'Masquer le mot de passe'
                        : 'Afficher le mot de passe'
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
                <Label htmlFor="confirm">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? 'text' : 'password'}
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
                        ? 'Masquer la confirmation du mot de passe'
                        : 'Afficher la confirmation du mot de passe'
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
              {state.error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {state.error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={pending}>
                {pending ? 'Enregistrement...' : 'Définir mon mot de passe'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
