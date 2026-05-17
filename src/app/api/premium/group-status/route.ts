import { isGroupPremium } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export function GET(request: Request) {
  const url = new URL(request.url)
  const userKeys =
    url.searchParams.get('userKeys')?.split(',').filter(Boolean) ?? []
  return json(request, { isPremium: isGroupPremium(userKeys) })
}
