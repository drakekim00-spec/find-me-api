export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui,sans-serif' }}>
      <h1>find-me API</h1>
      <p>라이프 시그널 안심 미니앱용 서버입니다.</p>
      <p>
        상태 확인: <a href="/api/health">/api/health</a>
      </p>
    </main>
  )
}
