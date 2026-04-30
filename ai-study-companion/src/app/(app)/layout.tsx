import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AppSidebar />
        <div className="flex min-h-screen flex-col">
          <AppHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}