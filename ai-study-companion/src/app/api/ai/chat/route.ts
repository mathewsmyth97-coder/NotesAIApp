import type { ChatMessage } from '@/features/study-session/types/session.types'

const getKeyword = (sourceText: string) => {
  const [keyword] = sourceText
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 5)

  return keyword ?? 'this topic'
}

export async function POST(request: Request) {
  const body = await request.json()
  const { sourceText, tone, level, messages } = body

  if (!sourceText) {
    return Response.json({ error: 'Missing sourceText' }, { status: 400 })
  }

  const conversation = Array.isArray(messages) ? (messages as ChatMessage[]) : []
  const latestUserMessage = [...conversation].reverse().find((message) => message.role === 'user')

  if (!latestUserMessage?.content) {
    return Response.json({ error: 'Missing user message' }, { status: 400 })
  }

  const keyword = getKeyword(sourceText)
  const depth =
    level === 'advanced'
      ? 'I will connect the answer to a precise detail from the material.'
      : 'I will keep the answer focused on the main idea.'
  const style =
    tone === 'detailed'
      ? 'Here is a detailed way to think about it'
      : 'Here is the concise version'

  const content = `${style}: "${latestUserMessage.content}" relates to ${keyword}. ${depth} The key is to tie your answer back to the session notes instead of treating it as a standalone fact.`
  const encoder = new TextEncoder()
  const chunks = content.match(/\S+\s*/g) ?? [content]

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk))
        await new Promise((resolve) => setTimeout(resolve, 20))
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
