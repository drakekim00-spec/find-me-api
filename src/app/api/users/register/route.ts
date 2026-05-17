import { registerPhone } from '@/lib/storage'
import { normalizePhone } from '@/lib/phone'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    userKey?: string
    phone?: string
  }
  if (body.userKey && body.phone) {
    registerPhone(normalizePhone(body.phone), body.userKey)
  }
  return json(request, { ok: true })
}
