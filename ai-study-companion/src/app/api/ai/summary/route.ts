import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { sourceText, tone } = body

  if (!sourceText) {
    return NextResponse.json({ error: 'Missing sourceText' }, { status: 400 })
  }

  return NextResponse.json({
    text:
      tone === 'detailed'
        ? `Detailed summary for: ${sourceText.slice(0, 140)}...`
        : `Concise summary for: ${sourceText.slice(0, 90)}...`,
    bulletPoints: [
      'Important concept one',
      'Important concept two',
      'Important concept three',
    ],
  })
}