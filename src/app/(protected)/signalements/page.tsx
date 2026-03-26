import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { StatusBadge } from '@/components/status-badge'
import { formatDate } from '@/lib/utils'
import { ValidateReportButton } from '@/components/validate-report-button'
import { RejectReportButton } from '@/components/reject-report-button'

export default async function SignalementsPage() {
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

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Signalements en attente</h1>
        <p className="text-sm text-gray-500">{reports?.length ?? 0} signalement(s) à traiter</p>
      </div>

      <div className="space-y-6">
        {reports?.map((report) => (
          <div key={report.id} className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">
                  {report.weward_pseudos.length > 0
                    ? report.weward_pseudos.join(', ')
                    : <span className="text-gray-400">Pseudo inconnu</span>}
                </p>
                {(report.facebook_first_name || report.facebook_last_name) && (
                  <p className="text-sm text-gray-600">
                    {[report.facebook_first_name, report.facebook_last_name].filter(Boolean).join(' ')}
                  </p>
                )}
              </div>
              <StatusBadge status={report.status} />
            </div>

            {report.arnaque_type && (
              <p className="text-sm text-orange-700 bg-orange-50 rounded px-2 py-1 inline-block">
                {report.arnaque_type}
              </p>
            )}

            {report.description && (
              <p className="text-sm text-gray-600 line-clamp-3">{report.description}</p>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Soumis le {formatDate(report.created_at)}</span>
              {report.profiles && (
                <span>par {(report.profiles as { display_name: string }).display_name}</span>
              )}
            </div>

            <div className="flex gap-2 pt-1 border-t border-gray-100">
              <ValidateReportButton report={report} />
              <RejectReportButton reportId={report.id} />
            </div>
          </div>
        ))}

        {(!reports || reports.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Aucun signalement en attente</p>
            <p className="text-sm mt-1">Tous les signalements ont été traités.</p>
          </div>
        )}
      </div>
    </div>
  )
}
