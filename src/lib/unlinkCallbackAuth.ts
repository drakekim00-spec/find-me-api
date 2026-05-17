/** 토스 연결 끊기 콜백 — 콘솔에 등록한 Basic Auth 와 일치해야 함 */

export function isUnlinkCallbackAuthConfigured(): boolean {
  return Boolean(
    process.env.TOSS_UNLINK_CALLBACK_USER?.trim() &&
      process.env.TOSS_UNLINK_CALLBACK_PASSWORD?.trim(),
  )
}

export function verifyUnlinkCallbackAuth(request: Request): boolean {
  const expectedUser = process.env.TOSS_UNLINK_CALLBACK_USER?.trim()
  const expectedPass = process.env.TOSS_UNLINK_CALLBACK_PASSWORD?.trim()
  if (!expectedUser || !expectedPass) return false

  const header = request.headers.get('authorization')?.trim()
  if (!header?.toLowerCase().startsWith('basic ')) return false

  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
    const colon = decoded.indexOf(':')
    if (colon < 0) return false
    const user = decoded.slice(0, colon)
    const pass = decoded.slice(colon + 1)
    return user === expectedUser && pass === expectedPass
  } catch {
    return false
  }
}

/** 콘솔 「Basic Auth 헤더」 입력값 (Authorization 헤더 전체) */
export function formatUnlinkCallbackAuthHeader(
  user: string,
  password: string,
): string {
  const token = Buffer.from(`${user}:${password}`, 'utf8').toString('base64')
  return `Basic ${token}`
}
