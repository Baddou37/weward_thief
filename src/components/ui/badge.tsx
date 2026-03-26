import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200',
        confirmed: 'bg-transparent px-0 text-blue-600 dark:text-blue-400',
        suspected: 'bg-transparent px-0 text-blue-600 dark:text-blue-400',
        pending: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
        approved: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
