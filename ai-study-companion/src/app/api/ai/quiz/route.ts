import { NextResponse } from 'next/server'
import type { QuizQuestion } from '@/features/quiz/types/quiz.types'

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
  const challenge = level === 'advanced' ? 'best evaluates' : 'describes'
  const excerpt = `${sourceText.slice(0, 100)}${sourceText.length > 100 ? '...' : ''}`

  const quiz: QuizQuestion[] = [
    {
      id: '1',
      question: `Which option ${challenge} the main idea of ${keyword}?`,
      options: [
        `It explains ${keyword} using the study material.`,
        'It is unrelated background information.',
        'It only lists vocabulary without context.',
        'It contradicts the notes.',
      ],
      correctAnswer: `It explains ${keyword} using the study material.`,
      explanation: `The source centers on ${keyword}, so the strongest answer should connect back to that concept.`,
    },
    {
      id: '2',
      question: 'Which detail should you use as evidence when answering?',
      options: [
        excerpt,
        'A detail from a different topic.',
        'A guess that is not in the notes.',
        'A definition with no connection to the material.',
      ],
      correctAnswer: excerpt,
      explanation: 'Using the provided material keeps the answer grounded in the session source text.',
    },
    {
      id: '3',
      question: 'What is the best next step after learning this concept?',
      options: [
        'Explain it in your own words and test it with examples.',
        'Skip review until the exam.',
        'Memorize only the title.',
        'Ignore any confusing parts.',
      ],
      correctAnswer: 'Explain it in your own words and test it with examples.',
      explanation: 'Self-explanation and retrieval practice help turn recognition into usable understanding.',
    },
  ]

  return NextResponse.json(quiz)
}
