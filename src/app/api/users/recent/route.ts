import { listRegisteredUsers } from '@/lib/storage'
import { json, options } from '@/lib/cors'

export function OPTIONS(request: Request) {
  return options(request)
}

/** 최근 등록된 userKey 목록 (QR 테스트 확인용) */
export function GET(request: Request) {
  const users = listRegisteredUsers(30)
  return json(request, {
    count: users.length,
    users,
    note:
      users.length === 0
        ? '아직 없음. 토스앱에서 미니앱을 한 번 연 뒤 다시 확인하세요.'
        : undefined,
  })
}
