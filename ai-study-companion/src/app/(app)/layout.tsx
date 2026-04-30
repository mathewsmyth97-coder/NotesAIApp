import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (error || !claims) {
    redirect('/auth/sign-in')
  }

  const userEmail =
    typeof claims.email === 'string' ? claims.email : 'Signed in'

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AppSidebar />
        <div className="flex min-h-screen flex-col">
          <AppHeader userEmail={userEmail} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
