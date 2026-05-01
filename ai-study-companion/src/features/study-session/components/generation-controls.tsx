import type { ComponentProps, ReactNode } from 'react'
import { Button, Spinner } from '@heroui/react'
import { AiUsageMeter } from '@/features/ai-usage/components/ai-usage-meter'
import { SessionFeatureCard } from '@/features/study-session/components/session-feature-card'

type ButtonVariant = ComponentProps<typeof Button>['variant']

export function RegenerateButton({
  label,
  isPending,
  onPress,
  variant = 'outline',
}: {
  label: string
  isPending: boolean
  onPress: () => void
  variant?: ButtonVariant
}) {
  return (
    <Button variant={variant} onPress={onPress} isDisabled={isPending}>
      {isPending ? <Spinner size="sm" /> : null}
      {label}
    </Button>
  )
}

export function GenerationToolbar({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center justify-end gap-3">{children}</div>
}

export function GenerationStatusCard({
  title,
  description,
  status,
  message,
  actionLabel,
  isActionPending = false,
  onAction,
}: {
  title: string
  description: string
  status: 'loading' | 'error'
  message: string
  actionLabel?: string
  isActionPending?: boolean
  onAction?: () => void
}) {
  const isError = status === 'error'

  return (
    <SessionFeatureCard
      title={title}
      description={description}
      descriptionClassName={isError ? 'text-danger' : undefined}
      className={isError ? 'border-danger/30' : undefined}
      contentClassName="gap-4"
    >
      {isError ? (
        <>
          <p className="text-sm text-muted-foreground">{message}</p>
          {actionLabel && onAction ? (
            <div className="flex flex-wrap items-center gap-3">
              <AiUsageMeter />
              <RegenerateButton
                label={actionLabel}
                isPending={isActionPending}
                onPress={onAction}
                variant="primary"
              />
            </div>
          ) : null}
        </>
      ) : (
        <div className="flex items-center gap-3 py-2">
          <Spinner size="sm" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      )}
    </SessionFeatureCard>
  )
}
