import { acknowledgeEmergency } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    guardianUserKey?: string
    wardUserKey?: string
  }
  if (body.wardUserKey) {
    acknowledgeEmergency(body.wardUserKey)
  }
  return json(request, { ok: true })
}
