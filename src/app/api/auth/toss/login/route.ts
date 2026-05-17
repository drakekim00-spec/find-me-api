import { json, options } from '@/lib/cors'
import { exchangeAuthorizationCode } from '@/lib/tossOAuth'
import { registerUserKey } from '@/lib/storage'
import { isTossMtlsConfigured } from '@/lib/tossMtls'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  if (!isTossMtlsConfigured()) {
    return json(request, { ok: false, reason: 'mtls_not_configured' }, 503)
  }

  const body = (await request.json()) as {
    authorizationCode?: string
    referrer?: string
  }

  const authorizationCode = body.authorizationCode?.trim()
  const referrer = body.referrer?.trim() ?? 'DEFAULT'

  if (!authorizationCode) {
    return json(request, { ok: false, reason: 'authorizationCode_required' }, 400)
  }

  const result = await exchangeAuthorizationCode({
    authorizationCode,
    referrer,
  })

  if (!result.ok) {
    console.warn('[api] toss login failed', result)
    return json(request, { ok: false, reason: result.reason, detail: result.detail }, 502)
  }

  registerUserKey(result.userKey)
  console.info('[api] toss login ok', { userKey: result.userKey })

  return json(request, { ok: true, userKey: result.userKey })
}
