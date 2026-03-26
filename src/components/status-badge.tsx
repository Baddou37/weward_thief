import { Badge } from '@/components/ui/badge'
import type { ThiefStatus, ReportStatus } from '@/types'

interface StatusBadgeProps {
  status: ThiefStatus | ReportStatus
}

const labels: Record<string, string> = {
  confirmed: '🔴 Confirmé',
  suspected: '🟡 Suspecté',
  pending: '⏳ En attente',
  approved: '✅ Approuvé',
  rejected: '❌ Rejeté',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge variant={status as 'confirmed' | 'suspected' | 'pending' | 'approved' | 'rejected'}>
      {labels[status] ?? status}
    </Badge>
  )
}
