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
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
  contentClassName?: string
  descriptionClassName?: string
}) {
  return (
    <Card className={cn('border border-border bg-card', className)}>
      <CardHeader className="flex flex-col items-start gap-1">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description ? (
          <p className={cn('text-sm text-muted-foreground', descriptionClassName)}>
            {description}
          </p>
        ) : null}
      </CardHeader>

      <Separator />

      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}
