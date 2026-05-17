import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  const body = (await request.json()) as { guardianUserKeys?: string[] }
  const count = body.guardianUserKeys?.length ?? 0
  console.info('[api] inactivity-alert', count)
  return json(request, { ok: true, recipientCount: count })
}
