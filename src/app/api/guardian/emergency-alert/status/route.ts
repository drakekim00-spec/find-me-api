import { getEmergency } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export function GET(request: Request) {
  const url = new URL(request.url)
  const wardUserKey = url.searchParams.get('wardUserKey') ?? ''
  const guardianUserKey = url.searchParams.get('guardianUserKey') ?? ''
  const session = getEmergency(wardUserKey)
  const acknowledged = Boolean(session?.acknowledgedAt)
  const isTarget = session?.guardianUserKeys.includes(guardianUserKey) ?? false
  return json(request, {
    active: Boolean(session && !acknowledged && isTarget),
    acknowledged,
  })
}
