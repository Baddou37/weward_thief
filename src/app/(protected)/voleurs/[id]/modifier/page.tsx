import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { EditThiefForm } from '@/components/edit-thief-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getT } from '@/lib/i18n/server'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModifierThiefPage({ params }: PageProps) {
  const { id } = await params
  const { t } = await getT()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect(`/voleurs/${id}`)

  const { data: thief } = await supabase.from('thieves').select('*').eq('id', id).single()
  if (!thief) notFound()

  return (
    <div className="p-4 lg:p-6 max-w-lg mx-auto">
      <div className="mb-4">
        <Link href={`/voleurs/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200">
          <ArrowLeft className="h-4 w-4" />
          {t('thiefEdit.back')}
        </Link>
      </div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('thiefEdit.title')}</h1>
      <EditThiefForm thief={thief} />
    </div>
  )
}
