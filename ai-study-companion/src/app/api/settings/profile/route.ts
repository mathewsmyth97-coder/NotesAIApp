import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type ProfileRow = {
  id: string
  email: string | null
  display_name: string | null
  openrouter_chat_model: string | null
  openrouter_generation_model: string | null
}

const profileSelect =
  'id, email, display_name, openrouter_chat_model, openrouter_generation_model'

function toProfile(row: ProfileRow) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name ?? '',
    openrouterChatModel: row.openrouter_chat_model,
    openrouterGenerationModel: row.openrouter_generation_model,
  }
}

function normalizeText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return ''

  return value.trim().slice(0, maxLength)
}

function normalizeModelId(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null
  }

  if (typeof value !== 'string') {
    return null
  }

  const modelId = value.trim()

  if (!/^[a-zA-Z0-9._:/-]{1,200}$/.test(modelId)) {
    return null
  }

  return modelId
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

async function getOrCreateProfile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  user: NonNullable<Awaited<ReturnType<typeof getUser>>['user']>,
) {
  const { data, error } = await supabase
    .from('profiles')
    .select(profileSelect)
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  if (data) {
    return data as ProfileRow
  }

  const { data: createdProfile, error: createError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      email: user.email ?? null,
      display_name:
        typeof user.user_metadata.display_name === 'string'
          ? user.user_metadata.display_name
          : '',
    })
    .select(profileSelect)
    .single()

  if (createError) {
    throw new Error(createError.message)
  }

  return createdProfile as ProfileRow
}

export async function GET() {
  try {
    const { supabase, user } = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getOrCreateProfile(supabase, user)

    return NextResponse.json(toProfile(profile))
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to load profile.',
      },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const displayName = normalizeText(body.displayName, 80)
    const openrouterChatModel = normalizeModelId(body.openrouterChatModel)
    const openrouterGenerationModel = normalizeModelId(
      body.openrouterGenerationModel,
    )

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          email: user.email ?? null,
          display_name: displayName,
          openrouter_chat_model: openrouterChatModel,
          openrouter_generation_model: openrouterGenerationModel,
        },
        { onConflict: 'id' },
      )
      .select(profileSelect)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(toProfile(data as ProfileRow))
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update profile.',
      },
      { status: 500 },
    )
  }
}
