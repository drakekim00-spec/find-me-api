import { addGroupPremiumKeys } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    orderId?: string
    memberUserKeys?: string[]
  }
  addGroupPremiumKeys(body.memberUserKeys ?? [])
  console.info('[api] premium grant', body.orderId, body.memberUserKeys?.length)
  return json(request, { ok: true })
}
