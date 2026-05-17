import { isTossMtlsConfigured } from './tossMtls'
import { readTossSuccess, tossMtlsJson } from './tossMtlsRequest'

export type TossSendMessageResult =
  | { sent: true; raw: unknown }
  | { sent: false; reason: 'mtls_not_configured' | 'api_error'; detail?: string }

export async function tossSendMessage(params: {
  targetUserKey: string
  templateSetCode: string
  context: Record<string, string>
}): Promise<TossSendMessageResult> {
  if (!isTossMtlsConfigured()) {
    return { sent: false, reason: 'mtls_not_configured' }
  }

  const res = await tossMtlsJson<unknown>({
    method: 'POST',
    path: '/api-partner/v1/apps-in-toss/messenger/send-message',
    body: {
      templateSetCode: params.templateSetCode,
      context: params.context,
    },
    headers: {
      'x-toss-user-key': params.targetUserKey,
    },
  })

  if (!res.ok) {
    return {
      sent: false,
      reason: 'api_error',
      detail: `HTTP ${res.status} ${res.body.slice(0, 500)}`,
    }
  }

  const success = readTossSuccess(res.data)
  if (success !== null) {
    return { sent: true, raw: res.data }
  }

  return {
    sent: false,
    reason: 'api_error',
    detail: JSON.stringify(res.data).slice(0, 500),
  }
}

export { isTossMtlsConfigured }
