import { lookupUserKey } from '@/lib/storage'
import { normalizePhone } from '@/lib/phone'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export function GET(request: Request) {
  const phone = new URL(request.url).searchParams.get('phone') ?? ''
  const userKey = lookupUserKey(normalizePhone(phone))
  if (!userKey) {
    return json(request, {}, 404)
  }
  return json(request, { userKey })
}
