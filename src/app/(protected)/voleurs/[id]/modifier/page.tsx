import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { EditThiefForm } from '@/components/edit-thief-form'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ModifierThiefPage({ params }: PageProps) {
  const { id } = await params
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
        <Link href={`/voleurs/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          Retour à la fiche
        </Link>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-6">Modifier l&apos;entrée</h1>
      <EditThiefForm thief={thief} />
    </div>
  )
}
