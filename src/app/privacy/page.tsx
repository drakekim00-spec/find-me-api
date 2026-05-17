import type { CSSProperties } from 'react'

export const metadata = {
  title: '개인정보 처리방침 | 라이프 시그널 안심',
}

const wrap: CSSProperties = {
  maxWidth: 720,
  margin: '0 auto',
  padding: '32px 20px 48px',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  lineHeight: 1.65,
  color: '#191f28',
}

const h1: CSSProperties = { fontSize: 22, marginBottom: 8 }
const h2: CSSProperties = { fontSize: 16, marginTop: 28, marginBottom: 8 }
const p: CSSProperties = { margin: '8px 0', fontSize: 14 }
const muted: CSSProperties = { color: '#6b7684', fontSize: 13 }
const table: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
  marginTop: 12,
}

export default function PrivacyPage() {
  return (
    <main style={wrap}>
      <h1 style={h1}>개인정보 수집·이용 동의 (개인정보 처리방침)</h1>
      <p style={muted}>시행일: 2026년 5월 17일 · 서비스명: 라이프 시그널 안심</p>

      <p style={p}>
        「라이프 시그널 안심」은 이용자의 개인정보를 중요하게 생각하며,
        아래와 같이 수집·이용합니다.
      </p>

      <h2 style={h2}>1. 수집하는 개인정보 항목</h2>
      <table style={table}>
        <thead>
          <tr>
            <th style={{ borderBottom: '1px solid #e5e8eb', textAlign: 'left', padding: 8 }}>
              구분
            </th>
            <th style={{ borderBottom: '1px solid #e5e8eb', textAlign: 'left', padding: 8 }}>
              항목
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: 8, verticalAlign: 'top' }}>토스 로그인</td>
            <td style={{ padding: 8 }}>회원 식별값(userKey), 동의한 항목에 한함</td>
          </tr>
          <tr>
            <td style={{ padding: 8, verticalAlign: 'top' }}>서비스 이용</td>
            <td style={{ padding: 8 }}>
              보호자·피보호자 연결 정보, 안심·비상 알림 기록, 위치 정보(동의 시),
              기기·이용 기록
            </td>
          </tr>
          <tr>
            <td style={{ padding: 8, verticalAlign: 'top' }}>연락처(선택)</td>
            <td style={{ padding: 8 }}>초대 시 선택한 연락처의 이름·전화번호</td>
          </tr>
        </tbody>
      </table>

      <h2 style={h2}>2. 이용 목적</h2>
      <p style={p}>회원 식별, 보호자·피보호자 연결, 안심·비상 알림, 유료 결제·고객 지원</p>

      <h2 style={h2}>3. 보유·이용 기간</h2>
      <p style={p}>
        목적 달성 시 또는 관련 법령에 따른 기간까지 보관 후 파기합니다. 토스
        로그인 연결 해제 시 관련 정보는 정책에 따라 처리합니다.
      </p>

      <h2 style={h2}>4. 제3자 제공</h2>
      <p style={p}>
        알림·결제·인증을 위해 토스(앱인토스) 등 필요한 범위에서 제공될 수
        있습니다. 법령상 요구가 있는 경우 예외적으로 제공할 수 있습니다.
      </p>

      <h2 style={h2}>5. 이용자의 권리</h2>
      <p style={p}>
        이용자는 개인정보 열람·정정·삭제·처리 정지를 요청할 수 있습니다. 토스
        앱 설정에서 로그인 연결 해제를 할 수 있습니다.
      </p>

      <h2 style={h2}>6. 동의 거부 시 불이익</h2>
      <p style={p}>
        필수 항목에 동의하지 않으면 회원가입·서비스 이용이 제한될 수
        있습니다.
      </p>

      <p style={{ ...muted, marginTop: 32 }}>
        <a href="/terms">서비스 이용약관</a>
        {' · '}
        <a href="/">홈</a>
      </p>
    </main>
  )
}
