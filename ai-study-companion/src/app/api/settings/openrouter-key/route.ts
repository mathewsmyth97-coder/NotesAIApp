import { NextResponse } from 'next/server'
import { encryptSecret } from '@/lib/crypto'
import { createClient } from '@/lib/supabase/server'

type UserApiKeyMetadataRow = {
  id: string
  key_last4: string
  updated_at: string
}

function maskKey(keyLast4: string) {
  return `sk-or-...${keyLast4}`
}

function normalizeOpenRouterKey(value: unknown) {
  if (typeof value !== 'string') {
    return null
  }

  const key = value.trim()

  if (!key.startsWith('sk-or-') || key.length < 20) {
    return null
  }

  return key
}

async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { supabase, user: null }
  }

  return { supabase, user }
}

export async function GET() {
  const { supabase, user } = await getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('user_api_keys')
    .select('id, key_last4, updated_at')
    .eq('provider', 'openrouter')
    .eq('is_active', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const row = data as UserApiKeyMetadataRow | null

  if (!row) {
    return NextResponse.json({ hasKey: false })
  }

  return NextResponse.json({
    hasKey: true,
    maskedKey: maskKey(row.key_last4),
    updatedAt: row.updated_at,
  })
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const apiKey = normalizeOpenRouterKey(body.apiKey)

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Enter a valid OpenRouter API key.' },
        { status: 400 },
      )
    }

    const encryptedKey = encryptSecret(apiKey)
    const keyLast4 = apiKey.slice(-4)
    const now = new Date().toISOString()

    const { error: deactivateError } = await supabase
      .from('user_api_keys')
      .update({ is_active: false, updated_at: now })
      .eq('provider', 'openrouter')
      .eq('is_active', true)

    if (deactivateError) {
      return NextResponse.json({ error: deactivateError.message }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('user_api_keys')
      .insert({
        user_id: user.id,
        provider: 'openrouter',
        encrypted_key: encryptedKey,
        key_last4: keyLast4,
        is_active: true,
        updated_at: now,
      })
      .select('key_last4, updated_at')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const row = data as Pick<UserApiKeyMetadataRow, 'key_last4' | 'updated_at'>

    return NextResponse.json({
      hasKey: true,
      maskedKey: maskKey(row.key_last4),
      updatedAt: row.updated_at,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Failed to save OpenRouter key.',
      },
      { status: 500 },
    )
  }
}

export async function DELETE() {
  const { supabase, user } = await getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('user_api_keys')
    .update({
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('provider', 'openrouter')
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ hasKey: false })
}
