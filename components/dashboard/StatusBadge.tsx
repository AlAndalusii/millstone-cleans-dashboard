import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export type Status = 'upcoming' | 'overdue' | 'completed'

export function getStatus(cleaningDate: string, completed: boolean): Status {
  if (completed) return 'completed'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(cleaningDate)
  date.setHours(0, 0, 0, 0)
  return date >= today ? 'upcoming' : 'overdue'
}

const statusConfig: Record<
  Status,
  { label: string; icon: React.ElementType; style: React.CSSProperties }
> = {
  upcoming: {
    label: 'Upcoming',
    icon: Clock,
    style: {
      backgroundColor: 'var(--status-upcoming-bg)',
      color: 'var(--status-upcoming-text)',
      borderColor: 'color-mix(in oklch, var(--status-upcoming) 30%, transparent)',
    },
  },
  overdue: {
    label: 'Overdue',
    icon: AlertCircle,
    style: {
      backgroundColor: 'var(--status-overdue-bg)',
      color: 'var(--status-overdue-text)',
      borderColor: 'color-mix(in oklch, var(--status-overdue) 30%, transparent)',
    },
  },
  completed: {
    label: 'Completed',
    icon: CheckCircle2,
    style: {
      backgroundColor: 'var(--status-completed-bg)',
      color: 'var(--status-completed-text)',
      borderColor: 'color-mix(in oklch, var(--status-completed) 30%, transparent)',
    },
  },
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      style={config.style}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        className
      )}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}
