/** Vercel 서버리스: 워밍 동안 유지 (영구 저장은 추후 KV/DB 연동) */

export type StoredInvite = {
  inviteToken: string
  inviterName: string
  inviteePhone: string
  inviteeTargetRole: 'guardian' | 'ward'
  inviterUserKey?: string
  inviteeUserKey?: string
}

export type WardLocation = {
  wardUserKey: string
  latitude: number
  longitude: number
  accuracyMeters: number
  updatedAt: string
}

export type WardCycle = {
  wardUserKey: string
  cycleMinutes: number
  setByGuardianUserKey?: string
  updatedAt: string
}

export type EmergencySession = {
  sessionId: string
  wardUserKey: string
  wardName?: string
  guardianUserKeys: string[]
  startedAt: number
  acknowledgedAt?: number
}

type Store = {
  groupPremiumKeys: Set<string>
  phoneToUserKey: Map<string, string>
  invites: Map<string, StoredInvite>
  locations: Map<string, WardLocation>
  cycles: Map<string, WardCycle>
  emergencies: Map<string, EmergencySession>
}

function getStore(): Store {
  const g = globalThis as unknown as { __findMeApiStore?: Store }
  if (!g.__findMeApiStore) {
    g.__findMeApiStore = {
      groupPremiumKeys: new Set(),
      phoneToUserKey: new Map(),
      invites: new Map(),
      locations: new Map(),
      cycles: new Map(),
      emergencies: new Map(),
    }
  }
  return g.__findMeApiStore
}

export function addGroupPremiumKeys(keys: string[]) {
  const s = getStore()
  for (const key of keys) {
    if (key) s.groupPremiumKeys.add(key)
  }
}

export function isGroupPremium(userKeys: string[]): boolean {
  const s = getStore()
  return userKeys.some((key) => s.groupPremiumKeys.has(key))
}

export function registerPhone(phone: string, userKey: string) {
  getStore().phoneToUserKey.set(phone, userKey)
}

export function lookupUserKey(phone: string): string | undefined {
  return getStore().phoneToUserKey.get(phone)
}

export function saveInvite(invite: StoredInvite) {
  getStore().invites.set(invite.inviteToken, invite)
}

export function getInvite(token: string): StoredInvite | undefined {
  return getStore().invites.get(token)
}

export function saveLocation(loc: WardLocation) {
  getStore().locations.set(loc.wardUserKey, loc)
}

export function getLocation(wardUserKey: string): WardLocation | undefined {
  return getStore().locations.get(wardUserKey)
}

export function saveCycle(cycle: WardCycle) {
  getStore().cycles.set(cycle.wardUserKey, cycle)
}

export function getCycle(wardUserKey: string): WardCycle | undefined {
  return getStore().cycles.get(wardUserKey)
}

export function saveEmergency(session: EmergencySession) {
  getStore().emergencies.set(session.wardUserKey, session)
}

export function getEmergency(wardUserKey: string): EmergencySession | undefined {
  return getStore().emergencies.get(wardUserKey)
}

export function acknowledgeEmergency(wardUserKey: string) {
  const session = getStore().emergencies.get(wardUserKey)
  if (session) session.acknowledgedAt = Date.now()
}
