import https from 'node:https'
import { getTossMtlsAgent } from './tossMtls'

const TOSS_API_BASE =
  process.env.TOSS_API_BASE_URL?.replace(/\/$/, '') ??
  'https://apps-in-toss-api.toss.im'

export type TossMtlsJsonResult<T> =
  | { ok: true; data: T; status: number }
  | { ok: false; status: number; body: string; parsed?: unknown }

export async function tossMtlsJson<T>(options: {
  method: 'GET' | 'POST'
  path: string
  body?: unknown
  headers?: Record<string, string>
}): Promise<TossMtlsJsonResult<T>> {
  const agent = getTossMtlsAgent()
  if (!agent) {
    return { ok: false, status: 0, body: 'mtls_not_configured' }
  }

  const bodyText =
    options.body !== undefined ? JSON.stringify(options.body) : undefined
  const url = new URL(options.path, TOSS_API_BASE)

  return new Promise((resolve) => {
    const req = https.request(
      url,
      {
        method: options.method,
        agent,
        headers: {
          ...(bodyText
            ? {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bodyText),
              }
            : {}),
          ...options.headers,
        },
      },
      (res) => {
        const chunks: Buffer[] = []
        res.on('data', (chunk) => chunks.push(chunk as Buffer))
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8')
          let parsed: unknown
          try {
            parsed = JSON.parse(text)
          } catch {
            parsed = undefined
          }
          const status = res.statusCode ?? 0
          if (status >= 200 && status < 300) {
            resolve({ ok: true, data: parsed as T, status })
            return
          }
          resolve({ ok: false, status, body: text, parsed })
        })
      },
    )

    req.on('error', (err) => {
      resolve({ ok: false, status: 0, body: err.message })
    })

    if (bodyText) req.write(bodyText)
    req.end()
  })
}

export function readTossSuccess<T>(parsed: unknown): T | null {
  if (
    typeof parsed === 'object' &&
    parsed !== null &&
    'resultType' in parsed &&
    String((parsed as { resultType: unknown }).resultType).toUpperCase() ===
      'SUCCESS' &&
    'success' in parsed
  ) {
    return (parsed as { success: T }).success
  }
  return null
}
