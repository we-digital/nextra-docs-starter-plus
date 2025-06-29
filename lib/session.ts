import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getUserDisplayName } from './auth-utils'

export interface SessionPayload {
  userId: string
  username: string
  displayName?: string  // Optional for backward compatibility
  role: string
  iat: number
  exp: number
  [key: string]: any
}

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch (error) {
    console.log('Failed to verify session')
    return null
  }
}

export async function createSession(userId: string, username: string, displayName: string, role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const sessionPayload = { 
    userId, 
    username,
    displayName, 
    role, 
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expiresAt.getTime() / 1000)
  }
  
  const session = await encrypt(sessionPayload)
  
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  
  if (!session) return null
  
  const payload = await decrypt(session)
  
  // Handle backward compatibility - if displayName is missing, get it from auth-utils
  if (payload && !payload.displayName) {
    payload.displayName = getUserDisplayName(payload.username)
  }
  
  return payload
}

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  // Ensure displayName is present during session update
  if (!payload.displayName) {
    payload.displayName = getUserDisplayName(payload.username)
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const newSession = await encrypt({
    ...payload,
    exp: Math.floor(expires.getTime() / 1000)
  })

  const cookieStore = await cookies()
  cookieStore.set('session', newSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

export async function verifySession() {
  const session = await getSession()
  
  if (!session?.userId) {
    redirect('/login')
  }
  
  return { 
    isAuth: true, 
    userId: session.userId, 
    username: session.username, 
    displayName: session.displayName || session.username,
    role: session.role 
  }
} 