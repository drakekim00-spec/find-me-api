import { getCycle } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ wardUserKey: string }> },
) {
  const { wardUserKey } = await params
  const stored = getCycle(decodeURIComponent(wardUserKey))
  if (!stored) {
    return json(request, {}, 404)
  }
  return json(request, stored)
}
