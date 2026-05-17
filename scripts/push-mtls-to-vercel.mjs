/**
 * mTLS 인증서를 Vercel 환경 변수에 등록합니다.
 * 사용: node scripts/push-mtls-to-vercel.mjs [cert경로] [key경로]
 */
import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const defaultCert = path.resolve(root, '../find-me/mTLS/라이프시그널_public.crt')
const defaultKey = path.resolve(root, '../find-me/mTLS/라이프시그널_private.key')

const certPath = path.resolve(process.argv[2] ?? defaultCert)
const keyPath = path.resolve(process.argv[3] ?? defaultKey)

for (const p of [certPath, keyPath]) {
  if (!fs.existsSync(p)) {
    console.error(`[push-mtls] 파일 없음: ${p}`)
    process.exit(1)
  }
}

const cert = fs.readFileSync(certPath, 'utf8')
const key = fs.readFileSync(keyPath, 'utf8')

function upsertEnv(name, value) {
  console.info(`[push-mtls] Vercel env 등록: ${name} (production)`)
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
  if (child.status !== 0) {
    console.error(`[push-mtls] 실패: ${name}`)
    process.exit(child.status ?? 1)
  }
}

upsertEnv('TOSS_MTLS_CERT_PEM', cert)
upsertEnv('TOSS_MTLS_KEY_PEM', key)
upsertEnv('TOSS_SAFE_CHECKIN_TEMPLATE_CODE', 'life-signal-safety-safe_checkin')

console.info('[push-mtls] 완료. 이제 npx vercel --prod 로 배포하세요.')
