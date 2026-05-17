import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  const body = await request.json()
  console.info('[api] safe-alert (푸시는 추후 mTLS 연동)', body)
  return json(request, { ok: true })
}
