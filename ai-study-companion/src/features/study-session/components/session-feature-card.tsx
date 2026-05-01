import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, Separator } from '@heroui/react'
import { cn } from '@/lib/utils'

export function SessionFeatureCard({
  title,
  description,
  children,
  className,
  contentClassName,
  descriptionClassName,
  headerAction,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
  contentClassName?: string
  descriptionClassName?: string
  headerAction?: ReactNode
}) {
  return (
    <Card className={cn('border border-border bg-card', className)}>
      <CardHeader className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description ? (
            <p className={cn('text-sm text-muted-foreground', descriptionClassName)}>
              {description}
            </p>
          ) : null}
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </CardHeader>

      <Separator />

      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}
