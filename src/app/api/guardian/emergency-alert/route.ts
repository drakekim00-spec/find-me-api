import { saveEmergency } from '@/lib/storage'
import { json, options } from '@/lib/cors'
import { isTossMtlsConfigured, tossSendMessage } from '@/lib/tossSendMessage'

export function OPTIONS(request: Request) {
  return options(request)
}

type EmergencyAlertBody = {
  sessionId?: string
  wardUserKey?: string
  wardName?: string
  message?: string
  guardianUserKeys?: string[]
  templateCode?: string
}

export async function POST(request: Request) {
  const body = (await request.json()) as EmergencyAlertBody
  const wardUserKey = body.wardUserKey?.trim() ?? 'unknown-ward'
  const sessionId = body.sessionId?.trim() ?? `emergency-${Date.now()}`
  const guardianUserKeys = (body.guardianUserKeys ?? []).filter(Boolean)
  const templateCode =
    body.templateCode?.trim() ||
    process.env.TOSS_EMERGENCY_ALERT_TEMPLATE_CODE?.trim() ||
    process.env.TOSS_SAFE_CHECKIN_TEMPLATE_CODE?.trim() ||
    'life-signal-safety-safe_checkin'

  saveEmergency({
    sessionId,
    wardUserKey,
    wardName: body.wardName,
    guardianUserKeys,
    startedAt: Date.now(),
  })

  if (guardianUserKeys.length === 0) {
    return json(request, { ok: false, error: 'guardianUserKeys_required' }, 400)
  }

  const context: Record<string, string> = {
    alertType: 'emergency',
  }
  if (body.wardName) context.wardName = body.wardName
  if (body.message) context.message = body.message

  if (!isTossMtlsConfigured()) {
    console.warn('[api] emergency-alert: mTLS 미설정 — 푸시 생략', {
      sessionId,
      guardianCount: guardianUserKeys.length,
    })
    return json(request, {
      ok: true,
      sessionId,
      pushSent: false,
      reason: 'mtls_not_configured',
    })
  }

  let sentCount = 0
  let lastFailure: string | undefined

  for (const targetUserKey of guardianUserKeys) {
    const push = await tossSendMessage({
      targetUserKey,
      templateSetCode: templateCode,
      context,
    })
    if (push.sent) {
      sentCount += 1
    } else {
      lastFailure = push.reason
      console.error('[api] emergency-alert send-message 실패', {
        targetUserKey,
        push,
      })
    }
  }

  if (sentCount === 0) {
    return json(request, {
      ok: true,
      sessionId,
      pushSent: false,
      reason: lastFailure ?? 'push_failed',
    })
  }

  console.info('[api] emergency-alert send-message 성공', {
    sessionId,
    sentCount,
    guardianCount: guardianUserKeys.length,
    templateCode,
  })

  return json(request, {
    ok: true,
    sessionId,
    pushSent: true,
    sentCount,
  })
}
