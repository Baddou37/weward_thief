import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SetPasswordForm } from './set-password-form'

interface PageProps {
  searchParams: Promise<{ for?: string }>
}

export default async function SetPasswordPage({ searchParams }: PageProps) {
  const { for: forParam } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect('/login?error=session')
  }

  if (
    forParam &&
    forParam.toLowerCase().trim() !== user.email.toLowerCase().trim()
  ) {
    redirect('/login?error=wrong_account')
  }

  return <SetPasswordForm userEmail={user.email} />
}
