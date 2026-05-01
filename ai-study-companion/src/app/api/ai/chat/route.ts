import {
  getOpenRouterApiKeyForCurrentUser,
  MissingOpenRouterKeyError,
  OpenRouterKeyAuthError,
} from '@/lib/openrouter-user-key'
import { getOpenRouterModelForCurrentUser } from '@/lib/openrouter-model-preferences'
import {
  AiUsageLimitError,
  assertAppKeyUsageAllowed,
  recordAiUsage,
} from '@/lib/ai-usage'

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

type RequestBody = {
  sessionId: string
  title: string
  sourceText: string
  tone: 'concise' | 'detailed'
  level: 'beginner' | 'intermediate' | 'advanced'
  messages: ChatMessage[]
}

type OpenRouterErrorResponse = {
  error?: {
    code?: number | string
    message?: string
    metadata?: Record<string, unknown>
  }
}

const openRouterHeaders = {
  'Content-Type': 'application/json',
  'HTTP-Referer': process.env.OPENROUTER_SITE_URL ?? 'http://localhost:3000',
  'X-Title': 'AI Study Companion',
}

const getOpenRouterErrorPayload = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const body = await response.json() as OpenRouterErrorResponse

    return {
      code: body.error?.code,
      message: body.error?.message ?? 'OpenRouter request failed',
    }
  }

  return {
    code: undefined,
    message: await response.text(),
  }
}

const toChatError = (status: number, error: Awaited<ReturnType<typeof getOpenRouterErrorPayload>>) => {
  if (status === 402) {
    return {
      status,
      code: 'credits_exceeded',
      message:
        'OpenRouter credits are exhausted. Add credits or switch to an available free model before using chat.',
    }
  }

  if (status === 429) {
    return {
      status,
      code: 'rate_limited',
      message: 'OpenRouter is rate limiting this chat request. Wait a moment and try again.',
    }
  }

  return {
    status,
    code: typeof error.code === 'string' ? error.code : 'openrouter_error',
    message: error.message || 'OpenRouter request failed.',
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody
    const { title, sourceText, tone, level, messages } = body

    if (!sourceText || !Array.isArray(messages) || messages.length === 0) {
      return new Response('Invalid payload', { status: 400 })
    }

    const { apiKey, source } = await getOpenRouterApiKeyForCurrentUser()
    const model = await getOpenRouterModelForCurrentUser('chat')

    if (source === 'app') {
      await assertAppKeyUsageAllowed('chat')
    }

    const upstreamResponse = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          ...openRouterHeaders,
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          stream: true,
          messages: [
            {
              role: 'system',
              content:
                `You are an AI study companion. ` +
                `Help the user understand the session material clearly. ` +
                `Use a ${tone} tone. ` +
                `Target ${level} difficulty. ` +
                `Stay grounded in the provided study material and prior conversation.`,
            },
            {
              role: 'system',
              content:
                `Session title: ${title}\n\n` +
                `Study material:\n${sourceText}`,
            },
            ...messages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
          ],
        }),
      },
    )

    if (!upstreamResponse.ok || !upstreamResponse.body) {
      const upstreamError = await getOpenRouterErrorPayload(upstreamResponse)
      const chatError = toChatError(upstreamResponse.status, upstreamError)

      return Response.json(
        {
          code: chatError.code,
          message: chatError.message,
        },
        { status: chatError.status },
      )
    }

    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    const reader = upstreamResponse.body.getReader()

    const stream = new ReadableStream({
      async start(controller) {
        let buffer = ''
        let hasRecordedUsage = false
        let tokensUsed: number | null = null

        const recordChatUsage = async () => {
          if (source !== 'app' || hasRecordedUsage) return

          hasRecordedUsage = true
          await recordAiUsage({
            feature: 'chat',
            tokensUsed,
          })
        }

        try {
          while (true) {
            const { done, value } = await reader.read()

            if (done) break

            buffer += decoder.decode(value, { stream: true })

            const events = buffer.split('\n\n')
            buffer = events.pop() ?? ''

            for (const event of events) {
              const lines = event
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)

              for (const line of lines) {
                // Ignore SSE comments like ": OPENROUTER PROCESSING"
                if (line.startsWith(':')) continue
                if (!line.startsWith('data:')) continue

                const payload = line.slice(5).trim()

                if (payload === '[DONE]') {
                  await recordChatUsage()
                  controller.close()
                  return
                }

                try {
                  const json = JSON.parse(payload) as {
                    choices?: Array<{
                      delta?: { content?: string }
                      finish_reason?: string | null
                    }>
                    error?: { message?: string }
                    usage?: {
                      total_tokens?: number
                    }
                  }

                  if (json.error) {
                    controller.error(
                      new Error(json.error.message || 'OpenRouter stream error'),
                    )
                    return
                  }

                  if (typeof json.usage?.total_tokens === 'number') {
                    tokensUsed = json.usage.total_tokens
                  }

                  const content = json.choices?.[0]?.delta?.content

                  if (content) {
                    controller.enqueue(encoder.encode(content))
                  }

                  const finishReason = json.choices?.[0]?.finish_reason
                  if (finishReason === 'error') {
                    controller.error(new Error('OpenRouter stream error'))
                    return
                  }
                } catch {
                  // Ignore malformed SSE payloads safely
                }
              }
            }
          }

          await recordChatUsage()
          controller.close()
        } catch (error) {
          controller.error(error)
        } finally {
          reader.releaseLock()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    })
  } catch (error) {
    if (error instanceof OpenRouterKeyAuthError) {
      return Response.json(
        {
          code: 'unauthorized',
          message: error.message,
        },
        { status: 401 },
      )
    }

    if (error instanceof MissingOpenRouterKeyError) {
      return Response.json(
        {
          code: 'missing_openrouter_api_key',
          message: error.message,
        },
        { status: 400 },
      )
    }

    if (error instanceof AiUsageLimitError) {
      return Response.json(
        {
          code: 'usage_limit_reached',
          message: error.message,
        },
        { status: 429 },
      )
    }

    return new Response('Failed to stream chat response', { status: 500 })
  }
}
