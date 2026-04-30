export async function streamText(
  stream: ReadableStream<Uint8Array>,
  handlers: {
    onChunk?: (chunk: string) => void
  } = {},
) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let text = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (done) {
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      text += chunk
      handlers.onChunk?.(chunk)
    }

    const finalChunk = decoder.decode()

    if (finalChunk) {
      text += finalChunk
      handlers.onChunk?.(finalChunk)
    }

    return text
  } finally {
    reader.releaseLock()
  }
}
