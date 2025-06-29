# Nextra Docs Template with Authentication

A secure documentation starter template built with Nextra, Next.js 15, and React 19 — featuring session-based authentication and full-text search.

## Quick Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Environment setup:**
   ```bash
   # Create .env.local
   SESSION_SECRET=your-32-char-secret  # openssl rand -base64 32
   AUTH_USERNAME=admin
   AUTH_PASSWORD=your-secure-password
   ```

3. **Start development:**
   ```bash
   pnpm dev
   ```

Visit `http://localhost:3000` and login with your credentials.

## Features

- 🔒 **Session-based authentication** with JWT cookies
- 👥 **Multi-user support** with role-based access
- 🔍 **Full-text search** powered by Pagefind
- 📱 **Mobile responsive** with dark/light mode
- ⚡ **Built on latest stack** - Nextra Docs template & Next.js 15 & React 19

## Documentation

All setup instructions, customization guides, and deployment options are available in the documentation at `/` after starting the development server.

**Essential reading:**
- [Prerequisites & Quick Start](/installation/prerequisites) - System requirements and step-by-step setup
- [Authentication Setup](/installation/authentication_setup) - Complete auth configuration
- [Creating Content](/installation/creating_content) - Content creation guide
- [Deployment](/installation/deployment) - Production deployment guides

## License

MIT

