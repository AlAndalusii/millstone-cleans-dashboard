import { NextResponse } from 'next/server'
import { createSessionToken, SESSION_COOKIE } from '@/lib/session'

const VALID_PIN = process.env.DASHBOARD_PIN ?? '442'

export async function POST(request: Request) {
  const { pin } = await request.json()

  if (pin !== VALID_PIN) {
    return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 })
  }

  const token = createSessionToken()
  const response = NextResponse.json({ ok: true })

  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  })

  return response
}
