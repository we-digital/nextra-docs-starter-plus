'use client'

import { logout } from '../lib/auth-actions'

interface LogoutButtonProps {
  username: string;
  displayName?: string;
}

export default function LogoutButton({ username, displayName }: LogoutButtonProps) {
  const nameToDisplay = displayName || username;
  
  return (
    <form action={logout} className="logout-form">
      <span 
        className="username-display"
        title={`Logged in as: ${username}`}
      >
        <span className="welcome-text">Welcome, </span>{nameToDisplay}
      </span>
      <button
        type="submit"
        className="logout-button"
      >
        Logout
      </button>
    </form>
  )
} 