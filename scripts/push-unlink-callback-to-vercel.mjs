/**
 * 연결 끊기 콜백 Basic Auth 를 Vercel production env 에 등록합니다.
 * 사용: node scripts/push-unlink-callback-to-vercel.mjs [password]
 * password 생략 시 랜덤 생성 후 콘솔에 출력합니다.
 */
import { randomBytes } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const user = 'life-signal-unlink'
const password =
  process.argv[2]?.trim() || randomBytes(24).toString('base64url')

function upsertEnv(name, value) {
  console.info(`[unlink-callback] Vercel env: ${name} (production)`)
  const child = spawnSync(
    'npx',
    ['vercel', 'env', 'add', name, 'production', '--force'],
    {
      cwd: root,
      input: value,
      encoding: 'utf8',
      stdio: ['pipe', 'inherit', 'inherit'],
      shell: true,
    },
  )
  if (child.status !== 0) process.exit(child.status ?? 1)
}

upsertEnv('TOSS_UNLINK_CALLBACK_USER', user)
upsertEnv('TOSS_UNLINK_CALLBACK_PASSWORD', password)

const header = `Basic ${Buffer.from(`${user}:${password}`, 'utf8').toString('base64')}`

console.info('')
console.info('=== 앱인토스 콘솔 입력값 ===')
console.info('콜백 URL:', 'https://find-me-api.vercel.app/api/auth/toss/unlink')
console.info('HTTP 메서드: GET (또는 POST)')
console.info('Basic Auth 헤더:', header)
console.info('')
