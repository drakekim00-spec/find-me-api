import { saveCycle } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    wardUserKey: string
    cycleMinutes: number
    setByGuardianUserKey?: string
  }
  const stored = {
    ...body,
    updatedAt: new Date().toISOString(),
  }
  saveCycle(stored)
  return json(request, stored)
}
