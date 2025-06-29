'use server'

import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { createSession, deleteSession } from './session'
import { parseUsers, getUserDisplayName } from './auth-utils'

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required').trim(),
  password: z.string().min(1, 'Password is required').trim(),
})

export type LoginState = {
  errors?: {
    username?: string[]
    password?: string[]
  }
  message?: string
}

export async function login(prevState: LoginState, formData: FormData): Promise<LoginState> {
  // Validate form fields
  const validatedFields = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  })

  // If validation fails, return errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { username, password } = validatedFields.data

  try {
    // Get all valid users from environment
    const users = parseUsers()
    
    // Find user by username
    const user = Object.entries(users).find(([key, config]) => key === username)
    
    if (!user) {
      return {
        message: 'Invalid username or password',
      }
    }

    const [foundUsername, userConfig] = user

    // Verify password (compare plain text password from env with input)
    const isValidPassword = password === userConfig.password
    
    if (!isValidPassword) {
      return {
        message: 'Invalid username or password',
      }
    }

    // Get display name and role
    const displayName = userConfig.displayName || foundUsername
    const role = userConfig.roles?.[0] || 'user'
    
    // Create session with display name
    await createSession(foundUsername, foundUsername, displayName, role)

  } catch (error) {
    console.error('Login error:', error)
    return {
      message: 'Something went wrong. Please try again.',
    }
  }

  // Redirect to home page after successful login
  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
} 