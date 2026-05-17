import { getEmergency } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export function GET(request: Request) {
  const url = new URL(request.url)
  const wardUserKey = url.searchParams.get('wardUserKey') ?? ''
  const session = getEmergency(wardUserKey)
  const acknowledged = Boolean(session?.acknowledgedAt)
  return json(request, {
    active: Boolean(session && !acknowledged),
    acknowledged,
  })
}
