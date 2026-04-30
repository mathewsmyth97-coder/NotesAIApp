import { NextResponse } from 'next/server'
import type { Flashcard } from '@/features/flashcards/types/flashcards.types'

const getKeyword = (sourceText: string) => {
  const [keyword] = sourceText
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 5)

  return keyword ?? 'the topic'
}

export async function POST(request: Request) {
  const body = await request.json()
  const { sourceText, level } = body

  if (!sourceText) {
    return NextResponse.json({ error: 'Missing sourceText' }, { status: 400 })
  }

  const keyword = getKeyword(sourceText)
  const detail = level === 'advanced' ? 'precise details' : 'the main idea'

  const flashcards: Flashcard[] = [
    {
      id: '1',
      front: `What is the key idea behind ${keyword}?`,
      back: `Explain ${detail} using the source material as evidence.`,
    },
    {
      id: '2',
      front: `Why does ${keyword} matter?`,
      back: 'Connect the concept to a consequence, use case, or important relationship from the notes.',
    },
    {
      id: '3',
      front: 'What is one detail worth remembering?',
      back: `${sourceText.slice(0, 120)}${sourceText.length > 120 ? '...' : ''}`,
    },
  ]

  return NextResponse.json(flashcards)
}
