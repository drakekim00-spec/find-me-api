import { readTossSuccess, tossMtlsJson } from './tossMtlsRequest'

type GenerateTokenSuccess = {
  accessToken: string
  refreshToken?: string
  expiresIn?: string | number
  tokenType?: string
  scope?: string
}

type LoginMeSuccess = {
  userKey: number | string
  scope?: string
}

function mapReferrer(referrer: string): string {
  const r = referrer.trim()
  if (r.toUpperCase() === 'SANDBOX') return 'sandbox'
  return r || 'DEFAULT'
}

export async function exchangeAuthorizationCode(params: {
  authorizationCode: string
  referrer: string
}): Promise<
  | { ok: true; userKey: string }
  | { ok: false; reason: string; detail?: string }
> {
  const tokenRes = await tossMtlsJson<unknown>({
    method: 'POST',
    path: '/api-partner/v1/apps-in-toss/user/oauth2/generate-token',
    body: {
      authorizationCode: params.authorizationCode,
      referrer: mapReferrer(params.referrer),
    },
  })

  if (!tokenRes.ok) {
    return {
      ok: false,
      reason: 'token_exchange_failed',
      detail: tokenRes.body.slice(0, 300),
    }
  }

  const token = readTossSuccess<GenerateTokenSuccess>(tokenRes.data)
  if (!token?.accessToken) {
    return {
      ok: false,
      reason: 'token_exchange_failed',
      detail: 'no accessToken',
    }
  }

  const meRes = await tossMtlsJson<unknown>({
    method: 'GET',
    path: '/api-partner/v1/apps-in-toss/user/oauth2/login-me',
    headers: {
      Authorization: `Bearer ${token.accessToken}`,
    },
  })

  if (!meRes.ok) {
    return {
      ok: false,
      reason: 'login_me_failed',
      detail: meRes.body.slice(0, 300),
    }
  }

  const me = readTossSuccess<LoginMeSuccess>(meRes.data)
  if (me?.userKey === undefined || me.userKey === null) {
    return {
      ok: false,
      reason: 'login_me_failed',
      detail: 'no userKey',
    }
  }

  return { ok: true, userKey: String(me.userKey) }
}
