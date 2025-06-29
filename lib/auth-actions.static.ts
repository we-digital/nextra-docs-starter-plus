// Static export compatible version - no Server Actions

export type LoginState = {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string
}

// For static export, authentication is not available
export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  return {
    message: 'Authentication not available in static export',
  }
}

export async function logout() {
  throw new Error('Authentication not available in static export')
} 