'use client'

import { useActionState } from 'react'
import { login, type LoginState } from '../../lib/auth-actions'
import Image from 'next/image'
import '../../styles/login.css'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<LoginState, FormData>(login, {})

  return (
      <div className="login-container">

        <div className="login-header">
          <h2 className="login-title">
            <Image
                src="/images/brand-logo.png"
                alt="Nextra Logo"
                width={ 30 }
                height={ 30 }
                className="login-logo"
            />
            Nextra Docs Starter +
          </h2>
          <p className="login-subtitle">
            Enter your credentials to access the documentation
          </p>
        </div>
        <div className="login-card">
          <form className="login-form" action={ formAction }>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Enter your username"
                  disabled={ isPending }
              />
              { state?.errors?.username && (
                  <p className="error-message">{ state.errors.username[ 0 ] }</p>
              ) }
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="form-input"
                  placeholder="Enter your password"
                  disabled={ isPending }
              />
              { state?.errors?.password && (
                  <p className="error-message">{ state.errors.password[ 0 ] }</p>
              ) }
            </div>

            <div className="demo-credentials">
              <p className="demo-text">
                Demo credentials: <strong>demo</strong> / <strong>demo</strong>
              </p>
            </div>

            { state?.message && (
                <div className="error-alert">
                  <p>{ state.message }</p>
                </div>
            ) }

            <button
                type="submit"
                disabled={ isPending }
                className="login-button"
            >
              { isPending ? 'Signing in...' : 'Sign in' }
            </button>
          </form>
        </div>
      </div>
  )
}
