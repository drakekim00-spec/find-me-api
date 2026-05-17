import https from 'node:https'

const TOSS_API_HOST = 'apps-in-toss-api.toss.im'

let cachedAgent: https.Agent | undefined

function normalizePem(value: string): string {
  const trimmed = value.trim()
  if (trimmed.includes('\\n')) {
    return trimmed.replace(/\\n/g, '\n')
  }
  return trimmed
}

/** Vercel 환경 변수: TOSS_MTLS_CERT_PEM, TOSS_MTLS_KEY_PEM (PEM 전체 문자열) */
export function getTossMtlsAgent(): https.Agent | null {
  const cert = process.env.TOSS_MTLS_CERT_PEM
  const key = process.env.TOSS_MTLS_KEY_PEM
  if (!cert?.trim() || !key?.trim()) {
    return null
  }

  if (!cachedAgent) {
    cachedAgent = new https.Agent({
      cert: normalizePem(cert),
      key: normalizePem(key),
      rejectUnauthorized: true,
      servername: TOSS_API_HOST,
    })
  }

  return cachedAgent
}

export function isTossMtlsConfigured(): boolean {
  return Boolean(
    process.env.TOSS_MTLS_CERT_PEM?.trim() &&
      process.env.TOSS_MTLS_KEY_PEM?.trim(),
  )
}
