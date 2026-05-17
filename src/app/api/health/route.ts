import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export function GET(request: Request) {
  return json(request, { ok: true, service: 'find-me-api' })
}
