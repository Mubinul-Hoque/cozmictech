import { SignJWT, jwtVerify } from 'jose';

if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('FATAL: JWT_SECRET is not set in production!');
}

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'your-very-secure-fallback-secret');
const alg = 'HS256';

export async function signJwt(payload: any, expiresIn: string = '1d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    return null;
  }
}
