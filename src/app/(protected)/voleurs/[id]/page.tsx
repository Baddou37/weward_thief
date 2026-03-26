import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { StatusBadge } from '@/components/status-badge'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ExternalLink, ArrowLeft } from 'lucide-react'
import { DeleteThiefButton } from '@/components/delete-thief-button'
import { getT } from '@/lib/i18n/server'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ThiefPage({ params }: PageProps) {
  const { id } = await params
  const { locale, t } = await getT()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const { data: thief } = await supabase
    .from('thieves')
    .select('*, profiles!created_by(display_name)')
    .eq('id', id)
    .single()

  if (!thief) notFound()

  const isAdmin = profile?.role === 'admin'
  const fullName = [thief.facebook_first_name, thief.facebook_last_name].filter(Boolean).join(' ')

  return (
    <div className="p-4 lg:p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <Link href="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:text-gray-200">
          <ArrowLeft className="h-4 w-4" />
          {t('thief.backDashboard')}
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4 lg:p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            {fullName ? (
              thief.facebook_url ? (
                <a
                  href={thief.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-bold text-blue-600 hover:underline dark:text-blue-400 flex items-center gap-1"
                >
                  {fullName}
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{fullName}</h1>
              )
            ) : (
              <h1 className="text-xl font-bold text-gray-400 dark:text-gray-500">{t('thief.unknownName')}</h1>
            )}
          </div>
          <StatusBadge status={thief.status} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('thief.pseudos')}</h2>
          {thief.weward_pseudos.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {thief.weward_pseudos.map((p: string, i: number) => (
                <span key={i} className="bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  {p}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 dark:text-gray-500 text-sm">{t('thief.noPseudos')}</p>
          )}
        </div>

        {thief.arnaque_type && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('thief.scamType')}</h2>
            <p className="text-gray-800 dark:text-gray-100">{thief.arnaque_type}</p>
          </div>
        )}

        {thief.description && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{t('thief.description')}</h2>
            <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{thief.description}</p>
          </div>
        )}

        {thief.infraction_urls.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {t('thief.proofs')} ({thief.infraction_urls.length})
            </h2>
            <ul className="space-y-1">
              {thief.infraction_urls.map((url: string, i: number) => (
                <li key={i}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400 text-sm flex items-center gap-1 break-all"
                  >
                    <ExternalLink className="h-3 w-3 shrink-0" />
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 text-sm text-gray-400 dark:text-gray-500 space-y-1">
          <p>{t('thief.addedOn')} {formatDate(thief.created_at, locale)}</p>
          {thief.profiles && (
            <p>{t('thief.by')} {(thief.profiles as { display_name: string }).display_name}</p>
          )}
        </div>

        {isAdmin && (
          <div className="flex gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
            <Button variant="outline" asChild>
              <Link href={`/voleurs/${id}/modifier`}>{t('thief.edit')}</Link>
            </Button>
            <DeleteThiefButton thiefId={id} />
          </div>
        )}
      </div>
    </div>
  )
}
