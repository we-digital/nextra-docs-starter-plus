// Static export compatible version - no server-only functions

export interface SessionPayload {
  userId: string
  username: string
  displayName?: string
  role: string
  iat: number
  exp: number
  [key: string]: any
}

// For static export, sessions are not available
export async function encrypt(payload: SessionPayload) {
  throw new Error('Sessions not available in static export')
}

export async function decrypt(session: string | undefined = '') {
  return null
}

export async function createSession(userId: string, username: string, displayName: string, role: string) {
  throw new Error('Sessions not available in static export')
}

export async function deleteSession() {
  throw new Error('Sessions not available in static export')
}

export async function getSession(): Promise<SessionPayload | null> {
  return null
}

export async function updateSession() {
  return null
}

export async function verifySession() {
  throw new Error('Sessions not available in static export')
} 