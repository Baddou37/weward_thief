'use server'

import { createClient } from '@/lib/supabase/server'

export type SetPasswordState = {
  error?: string
  success?: boolean
}

export async function setPasswordAction(
  _prev: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirm') ?? '')

  if (password !== confirm) {
    return { error: 'Les mots de passe ne correspondent pas.' }
  }
  if (password.length < 8) {
    return { error: 'Le mot de passe doit contenir au moins 8 caractères.' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return {
      error:
        'Session absente ou expirée. Ouvrez le lien « Créer mon mot de passe » reçu par email (il expire après 24 h).',
    }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return { error: 'Erreur : ' + error.message }
  }

  return { success: true }
}
