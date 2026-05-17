import { NextResponse } from 'next/server'

const TOSSMINI_ORIGINS = [
  'https://find-me.apps.tossmini.com',
  'https://find-me.private-apps.tossmini.com',
]

export function corsHeaders(request: Request): HeadersInit {
  const origin = request.headers.get('origin') ?? ''
  const allow =
    TOSSMINI_ORIGINS.includes(origin) ||
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:')

  return {
    'Access-Control-Allow-Origin': allow ? origin : TOSSMINI_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export function json(
  request: Request,
  body: unknown,
  status = 200,
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: corsHeaders(request),
  })
}

export function options(request: Request): NextResponse {
  return new NextResponse(null, { status: 204, headers: corsHeaders(request) })
}
