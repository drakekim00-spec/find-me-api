import { saveLocation, type WardLocation } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  const body = (await request.json()) as WardLocation
  saveLocation(body)
  return json(request, body)
}
