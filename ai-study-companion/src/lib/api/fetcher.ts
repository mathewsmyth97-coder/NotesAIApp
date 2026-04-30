export async function fetcher<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!response.ok) {
    let message = 'Request failed'

    try {
      const body = (await response.clone().json()) as {
        error?: unknown
        message?: unknown
      }

      if (typeof body.error === 'string') {
        message = body.error
      } else if (typeof body.message === 'string') {
        message = body.message
      }
    } catch {
      const text = await response.text()

      if (text) {
        message = text
      }
    }

    throw new Error(message)
  }

  return response.json()
}
