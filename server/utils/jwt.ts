import { SignJWT, jwtVerify } from 'jose';

if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable must be set in production. Server will not start without it.')
  } else {
    console.warn('[DEV] JWT_SECRET is not set — using insecure development fallback. Never deploy without this env var.')
  }
}

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'your-very-secure-fallback-secret-dev-only')
const alg = 'HS256'

export async function signJwt(payload: Record<string, unknown>, expiresIn: string = '1d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey)
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch {
    return null
  }
}
