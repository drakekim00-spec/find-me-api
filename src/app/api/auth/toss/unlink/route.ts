import { NextResponse } from 'next/server'
import {
  isUnlinkCallbackAuthConfigured,
  verifyUnlinkCallbackAuth,
} from '@/lib/unlinkCallbackAuth'
import { purgeUserData } from '@/lib/storage'

type UnlinkPayload = {
  userKey?: string | number
  referrer?: string
}

function parseUserKey(value: string | number | undefined): string {
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

function handleUnlink(payload: UnlinkPayload) {
  const userKey = parseUserKey(payload.userKey)
  const referrer = payload.referrer?.trim() ?? 'UNLINK'

  if (!userKey) {
    return NextResponse.json(
      { ok: false, error: 'userKey_required' },
      { status: 400 },
    )
  }

  const removed = purgeUserData(userKey)
  console.info('[api] toss unlink callback', { userKey, referrer, removed })

  return NextResponse.json({ ok: true, userKey, referrer, removed })
}

function unauthorized() {
  return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })
}

function checkAuth(request: Request): NextResponse | null {
  if (!isUnlinkCallbackAuthConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'unlink_callback_not_configured' },
      { status: 503 },
    )
  }
  if (!verifyUnlinkCallbackAuth(request)) {
    return unauthorized()
  }
  return null
}

/** 토스 연결 끊기 콜백 — GET ?userKey=&referrer= */
export async function GET(request: Request) {
  const authError = checkAuth(request)
  if (authError) return authError

  const url = new URL(request.url)
  return handleUnlink({
    userKey: url.searchParams.get('userKey') ?? undefined,
    referrer: url.searchParams.get('referrer') ?? undefined,
  })
}

/** 토스 연결 끊기 콜백 — POST { userKey, referrer } */
export async function POST(request: Request) {
  const authError = checkAuth(request)
  if (authError) return authError

  let body: UnlinkPayload
  try {
    body = (await request.json()) as UnlinkPayload
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  return handleUnlink(body)
}
