import type { CSSProperties } from 'react'

export const metadata = {
  title: '서비스 이용약관 | 라이프 시그널 안심',
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
  margin: '12px 0',
}
const th: CSSProperties = {
  border: '1px solid #e5e8eb',
  padding: '10px 8px',
  background: '#f9fafb',
  textAlign: 'left',
  verticalAlign: 'top',
}
const td: CSSProperties = {
  border: '1px solid #e5e8eb',
  padding: '10px 8px',
  verticalAlign: 'top',
}
const note: CSSProperties = { ...muted, margin: '4px 0 0', fontSize: 12 }

export default function TermsPage() {
  return (
    <main style={wrap}>
      <h1 style={h1}>라이프 시그널 안심 서비스 이용약관</h1>
      <p style={muted}>시행일: 2026년 5월 17일</p>

      <p style={p}>
        본 약관은 토스 앱 내 「라이프 시그널 안심」 미니앱(이하
        &quot;서비스&quot;)을 이용하는 회원과 서비스 제공자 간의 권리·의무를
        정합니다.
      </p>

      <h2 style={h2}>제1조 (목적)</h2>
      <p style={p}>
        서비스는 피보호자의 안심 확인·비상 알림·보호자 연결 등 안전 관련
        기능을 제공합니다.
      </p>

      <h2 style={h2}>제2조 (이용 조건)</h2>
      <p style={p}>
        이용자는 토스 로그인 및 서비스가 요구하는 동의 절차를 완료해야
        합니다. 타인의 정보를 무단으로 사용해서는 안 됩니다.
      </p>

      <h2 style={h2}>제3조 (서비스 내용)</h2>
      <p style={p}>
        서비스는 안심 주기 설정, 보호자·피보호자 연결, 알림 발송, 위치
        공유(이용자 동의 시) 등을 제공할 수 있습니다. 일부 기능은 유료일 수
        있습니다.
      </p>

      <h2 style={h2}>제4조 (이용자의 의무)</h2>
      <p style={p}>
        이용자는 관계 법령과 본 약관을 준수하고, 허위 신고·타인 괴롭힘·
        서비스 방해 행위를 해서는 안 됩니다.
      </p>

      <h2 style={h2}>제5조 (서비스 변경·중단)</h2>
      <p style={p}>
        운영상·기술상 필요한 경우 서비스의 전부 또는 일부를 변경·중단할 수
        있습니다. 중요한 변경은 앱 내 공지 등 합리적인 방법으로 안내합니다.
      </p>

      <h2 style={h2}>제6조 (요금제 및 유료 서비스)</h2>
      <p style={p}>
        서비스는 무료 요금제와 프리미엄 요금제를 제공합니다. 프리미엄은 토스
        인앱 결제로 구독하며, 결제·해지·환불은 토스 인앱 결제 및 관련 법령,
        스토어 정책에 따릅니다.
      </p>

      <table style={table}>
        <thead>
          <tr>
            <th style={th}>구분</th>
            <th style={th}>무료 요금제</th>
            <th style={th}>프리미엄 요금제</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={td}>이용요금</td>
            <td style={td}>무료</td>
            <td style={td}>월 4,400원 (부가세 포함)</td>
          </tr>
          <tr>
            <td style={td}>보호자 등록 제한</td>
            <td style={td}>최대 1명</td>
            <td style={td}>최대 5명</td>
          </tr>
          <tr>
            <td style={td}>안심 주기 설정 범위</td>
            <td style={td}>30분 ~ 3시간</td>
            <td style={td}>
              30분 ~ 3시간 및 4시간 ~ 최대 3일
              <br />
              (버튼으로 주기 연장 가능)
            </td>
          </tr>
          <tr>
            <td style={td}>위치 확인 및 공유</td>
            <td style={td}>
              이용 불가
              <br />
              (연결 그룹 내 유료 구독자 0명인 경우)
            </td>
            <td style={td}>
              위치 확인·공유 제공
              <br />
              (연결 그룹 내 1명 이상 유료 구독 시 그룹 전원 이용 가능)
            </td>
          </tr>
          <tr>
            <td style={td}>광고 노출 여부</td>
            <td style={td}>상단 배너 광고 노출</td>
            <td style={td}>
              본인이 프리미엄을 구독·결제한 경우 배너 광고 미노출
            </td>
          </tr>
        </tbody>
      </table>

      <p style={note}>
        ※ 연결 그룹: 피보호자 1명과 보호자(최대 5명)로 구성되며, 그룹 최대
        6명입니다. 그룹 구성원 중 1명만 프리미엄을 구독해도, 해당 그룹
        구성원 전원이 프리미엄 혜택(보호자 수·안심 주기·위치 등)을 이용할 수
        있습니다.
      </p>
      <p style={note}>
        ※ 위치 정보는 기기·통신 환경에 따라 주기적으로 갱신되며, 실시간
        추적·정확한 좌표를 보장하지 않습니다.
      </p>
      <p style={note}>
        ※ 그룹 공유 프리미엄 혜택만 받고 본인이 구독하지 않은 경우, 상단
        배너 광고가 노출될 수 있습니다.
      </p>

      <h2 style={h2}>제7조 (면책)</h2>
      <p style={p}>
        서비스는 안전 보조 수단이며, 모든 위험 상황을 예방·보장하지는
        않습니다. 통신 장애·기기 오류 등으로 알림이 지연·누락될 수 있습니다.
      </p>

      <h2 style={h2}>제8조 (문의)</h2>
      <p style={p}>
        서비스 관련 문의는 앱인토스 콘솔에 등록된 운영자 연락처로
        접수해 주세요.
      </p>

      <p style={{ ...muted, marginTop: 32 }}>
        <a href="/privacy">개인정보 처리방침</a>
        {' · '}
        <a href="/">홈</a>
      </p>
    </main>
  )
}
