import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatusBadge } from '@/components/status-badge'
import { formatDate } from '@/lib/utils'
import { ValidateReportButton } from '@/components/validate-report-button'
import { RejectReportButton } from '@/components/reject-report-button'
import { getT } from '@/lib/i18n/server'

export default async function SignalementsPage() {
  const { locale, t } = await getT()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: reports } = await supabase
    .from('reports')
    .select('*, profiles!submitted_by(display_name)')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  const n = reports?.length ?? 0
  const countLabel =
    locale === 'en'
      ? `${n} ${n === 1 ? t('reports.report') : t('reports.reports')} ${t('reports.toProcess')}`
      : `${n} ${n > 1 ? t('reports.reports') : t('reports.report')} ${t('reports.toProcess')}`

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('reports.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{countLabel}</p>
      </div>

      <div className="space-y-6">
        {reports?.map((report) => (
          <div key={report.id} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {report.weward_pseudos.length > 0
                    ? report.weward_pseudos.join(', ')
                    : <span className="text-gray-400">{t('dashboard.unknownPseudo')}</span>}
                </p>
                {(report.facebook_first_name || report.facebook_last_name) && (
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {[report.facebook_first_name, report.facebook_last_name].filter(Boolean).join(' ')}
                  </p>
                )}
              </div>
              <StatusBadge status={report.status} />
            </div>

            {report.arnaque_type && (
              <p className="text-sm text-orange-700 bg-orange-50 dark:text-orange-300 dark:bg-orange-950/40 rounded px-2 py-1 inline-block">
                {report.arnaque_type}
              </p>
            )}

            {report.description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{report.description}</p>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <span>{t('reports.submittedOn')} {formatDate(report.created_at, locale)}</span>
              {report.profiles && (
                <span>{t('reports.by')} {(report.profiles as { display_name: string }).display_name}</span>
              )}
            </div>

            <div className="flex gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
              <ValidateReportButton report={report} />
              <RejectReportButton reportId={report.id} />
            </div>
          </div>
        ))}

        {(!reports || reports.length === 0) && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg">{t('reports.noneTitle')}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('reports.noneSubtitle')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
