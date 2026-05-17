import { saveEmergency } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    sessionId?: string
    wardUserKey?: string
    wardName?: string
    guardianUserKeys?: string[]
  }
  const wardUserKey = body.wardUserKey ?? 'unknown-ward'
  const sessionId = body.sessionId ?? `emergency-${Date.now()}`
  saveEmergency({
    sessionId,
    wardUserKey,
    wardName: body.wardName,
    guardianUserKeys: body.guardianUserKeys ?? [],
    startedAt: Date.now(),
  })
  return json(request, { ok: true, sessionId })
}
