import { registerUserKey } from '@/lib/storage'
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
  const userKey = body.userKey?.trim()
  if (userKey) {
    const phone = body.phone ? normalizePhone(body.phone) : undefined
    registerUserKey(userKey, phone)
    console.info('[api] user register', { userKey, phone: phone ?? null })
  }
  return json(request, { ok: true })
}
