import { json, options } from '@/lib/cors'
import { isTossMtlsConfigured, tossSendMessage } from '@/lib/tossSendMessage'

export function OPTIONS(request: Request) {
  return options(request)
}

type SafeAlertBody = {
  fromUserKey?: string
  targetUserKey?: string
  targetPhone?: string
  message?: string
  wardName?: string
  deliverAlways?: boolean
  alertType?: string
  templateCode?: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as SafeAlertBody
  const targetUserKey = body.targetUserKey?.trim()
  const templateCode =
    body.templateCode?.trim() ||
    process.env.TOSS_SAFE_CHECKIN_TEMPLATE_CODE?.trim() ||
    'life-signal-safety-safe_checkin'

  if (!targetUserKey) {
    return json(request, { ok: false, error: 'targetUserKey_required' }, 400)
  }

  const context: Record<string, string> = {}
  if (body.wardName) context.wardName = body.wardName
  if (body.message) context.message = body.message
  if (body.alertType) context.alertType = body.alertType

  if (!isTossMtlsConfigured()) {
    console.warn('[api] safe-alert: mTLS 미설정 — 푸시 생략', {
      targetUserKey,
      templateCode,
    })
    return json(request, {
      ok: true,
      pushSent: false,
      reason: 'mtls_not_configured',
    })
  }

  const push = await tossSendMessage({
    targetUserKey,
    templateSetCode: templateCode,
    context,
  })

  if (!push.sent) {
    console.error('[api] safe-alert send-message 실패', push)
    return json(request, {
      ok: true,
      pushSent: false,
      reason: push.reason,
      detail: push.detail,
    })
  }

  console.info('[api] safe-alert send-message 성공', {
    targetUserKey,
    templateCode,
  })

  return json(request, { ok: true, pushSent: true })
}
