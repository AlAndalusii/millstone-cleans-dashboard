import { createHmac } from 'crypto'

const SECRET = process.env.SESSION_SECRET ?? 'millstone-dashboard-secret-2024'

export const SESSION_COOKIE = 'dashboard_session'

function sign(value: string) {
  return createHmac('sha256', SECRET).update(value).digest('hex')
}

export function createSessionToken() {
  const payload = JSON.stringify({ ok: true, ts: Date.now() })
  const sig = sign(payload)
  return Buffer.from(payload).toString('base64') + '.' + sig
}

export function verifySessionToken(token: string) {
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payloadB64, sig] = parts
  try {
    const payload = Buffer.from(payloadB64, 'base64').toString()
    return sign(payload) === sig
  } catch {
    return false
  }
}
