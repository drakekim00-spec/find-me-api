import { json, options } from '@/lib/cors'
import { isTossMtlsConfigured } from '@/lib/tossMtls'

export function OPTIONS(request: Request) {
  return options(request)
}

export function GET(request: Request) {
  return json(request, {
    ok: true,
    service: 'find-me-api',
    mtlsConfigured: isTossMtlsConfigured(),
  })
}
