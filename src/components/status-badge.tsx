'use client'

import { Badge } from '@/components/ui/badge'
import type { ThiefStatus, ReportStatus } from '@/types'
import { useTranslations } from '@/lib/i18n/use-translations'

interface StatusBadgeProps {
  status: ThiefStatus | ReportStatus
}

function labelFor(
  t: (key: string) => string,
  status: ThiefStatus | ReportStatus,
): string {
  switch (status) {
    case 'confirmed':
      return t('status.confirmed')
    case 'suspected':
      return t('status.suspected')
    case 'pending':
      return t('status.pending')
    case 'approved':
      return t('status.approved')
    case 'rejected':
      return t('status.rejected')
    default:
      return status
  }
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations()
  return (
    <Badge variant={status as 'confirmed' | 'suspected' | 'pending' | 'approved' | 'rejected'}>
      {labelFor(t, status)}
    </Badge>
  )
}
