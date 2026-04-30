import Link from 'next/link'
import { Sparkles, BookOpen, Brain, MessageSquare } from 'lucide-react'

const features = [
  {
    title: 'Summaries',
    description: 'Turn long notes into clear explanations and key takeaways.',
    icon: Sparkles,
  },
  {
    title: 'Flashcards',
    description: 'Generate quick-recall prompts from your study material.',
    icon: BookOpen,
  },
  {
    title: 'Quizzes',
    description: 'Test understanding with structured multiple-choice questions.',
    icon: Brain,
  },
  {
    title: 'Follow-up chat',
    description: 'Ask questions about the material and keep studying in context.',
    icon: MessageSquare,
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground">
            Portfolio starter project
          </div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            Turn messy notes into a clean AI study workflow.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Generate summaries, flashcards, quizzes, and contextual follow-up chat from a single study workspace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="rounded-2xl bg-foreground px-5 py-3 text-sm font-medium text-background transition hover:opacity-90"
            >
              Open dashboard
            </Link>
            <a
              href="#features"
              className="rounded-2xl border border-border px-5 py-3 text-sm font-medium transition hover:bg-accent"
            >
              View features
            </a>
          </div>
        </div>

        <div id="features" className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-2xl border border-border p-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}