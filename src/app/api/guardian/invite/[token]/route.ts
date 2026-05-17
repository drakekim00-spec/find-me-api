import { getInvite } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const invite = getInvite(decodeURIComponent(token))
  if (!invite) {
    return json(request, {}, 404)
  }
  return json(request, invite)
}
