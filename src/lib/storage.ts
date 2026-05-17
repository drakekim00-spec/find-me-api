import { normalizePhone } from '@/lib/phone'

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

export type RegisteredUser = {
  userKey: string
  phone?: string
  registeredAt: string
}

type Store = {
  groupPremiumKeys: Set<string>
  phoneToUserKey: Map<string, string>
  /** 앱 진입 시 등록된 userKey (QR 테스트 확인용, 서버 재시작 시 초기화) */
  registeredUsers: Map<string, RegisteredUser>
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
      registeredUsers: new Map(),
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

export function registerUserKey(userKey: string, phone?: string) {
  const key = userKey.trim()
  if (!key) return
  getStore().registeredUsers.set(key, {
    userKey: key,
    phone: phone?.trim() || undefined,
    registeredAt: new Date().toISOString(),
  })
  if (phone?.trim()) {
    getStore().phoneToUserKey.set(normalizePhone(phone), key)
  }
}

export function listRegisteredUsers(limit = 20): RegisteredUser[] {
  const users = [...getStore().registeredUsers.values()]
  users.sort((a, b) => b.registeredAt.localeCompare(a.registeredAt))
  return users.slice(0, limit)
}

export function registerPhone(phone: string, userKey: string) {
  registerUserKey(userKey, phone)
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

/** 토스 연결 끊기 콜백 — 서버에 저장된 해당 userKey 데이터 삭제 */
export function purgeUserData(userKey: string): boolean {
  const key = userKey.trim()
  if (!key) return false

  const s = getStore()
  const hadRegistered = s.registeredUsers.delete(key)
  s.groupPremiumKeys.delete(key)
  s.locations.delete(key)
  s.cycles.delete(key)
  s.emergencies.delete(key)

  for (const [phone, uk] of s.phoneToUserKey.entries()) {
    if (uk === key) s.phoneToUserKey.delete(phone)
  }

  for (const [token, invite] of s.invites.entries()) {
    if (invite.inviterUserKey === key || invite.inviteeUserKey === key) {
      s.invites.delete(token)
    }
  }

  return hadRegistered
}
