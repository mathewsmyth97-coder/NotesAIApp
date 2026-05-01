import { NextResponse } from 'next/server'
import { getCurrentAiUsageStatus } from '@/lib/ai-usage'

export async function GET() {
  try {
    return NextResponse.json(await getCurrentAiUsageStatus())
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to load AI usage.',
      },
      { status: 500 },
    )
  }
}
