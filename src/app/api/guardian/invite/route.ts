import {
  lookupUserKey,
  saveInvite,
  type StoredInvite,
} from '@/lib/storage'
import { normalizePhone } from '@/lib/phone'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

export async function POST(request: Request) {
  const body = (await request.json()) as StoredInvite
  const normalized = normalizePhone(body.inviteePhone)
  let inviteeUserKey = lookupUserKey(normalized)
  if (!inviteeUserKey && body.inviterUserKey) {
    inviteeUserKey = body.inviterUserKey
  }
  const stored: StoredInvite = {
    ...body,
    inviteeUserKey: inviteeUserKey ?? body.inviteeUserKey,
  }
  saveInvite(stored)
  console.info('[api] invite sent', stored.inviteToken, stored.inviteeTargetRole)
  return json(request, stored)
}
