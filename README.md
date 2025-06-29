<div align="center">

# Nextra Docs Starter Plus

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Nextra](https://img.shields.io/badge/Nextra-4.0-000000?style=for-the-badge&logo=nextra&logoColor=white)](https://nextra.site/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

**A modern, secure documentation starter template built with Nextra, Next.js 15, and React 19**

[🚀 Live Demo](https://docs-starter.we-digital.studio) • [🐛 Report Bug](https://github.com/we-digital/nextra-docs-starter-plus/issues/new) • [✨ Request Feature](https://github.com/we-digital/nextra-docs-starter-plus/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [Project Structure](#️-project-structure)
- [Customization](#-customization)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [Issues & Support](#-issues--support)
- [License](#-license)
- [Author](#-author)

---

## ✨ Features

### 🔒 **Authentication & Security**
- **Session-based authentication** with secure JWT cookies
- **Multi-user support** with role-based access control
- **Middleware protection** for sensitive routes
- **Environment-based configuration** for different deployment stages

### 📖 **Documentation Platform**
- **Nextra-powered** documentation with MDX support
- **Full-text search** powered by Pagefind indexing
- **Responsive design** with dark/light mode support
- **Mobile-first** approach for optimal viewing on all devices

### ⚡ **Modern Stack**
- **Next.js 15** with App Router and Server Components
- **React 19** with latest features and optimizations
- **TypeScript** for type-safe development
- **Hybrid rendering** for optimal performance

### 🎯 **Developer Experience**
- **Hot reload** in development mode
- **ESLint & Prettier** configuration
- **Type-safe** environment variables
- **Comprehensive documentation** and examples

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Framework** | [Next.js](https://nextjs.org/) | 15.x | React framework with SSR/SSG |
| **UI Library** | [React](https://reactjs.org/) | 19.x | Component-based UI library |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | 5.x | Type-safe JavaScript |
| **Documentation** | [Nextra](https://nextra.site/) | 4.x | Next.js-based docs framework |
| **Search** | [Pagefind](https://pagefind.app/) | Latest | Static site search |
| **Authentication** | Custom JWT | - | Session-based auth system |
| **Styling** | CSS Modules | - | Component-scoped styling |

---

## 🚀 Quick Start

Get up and running in less than 5 minutes:

```bash
# Clone the repository
git clone https://github.com/we-digital/nextra-docs-starter-plus.git
cd nextra-docs-starter-plus

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
pnpm dev
```

🎉 **That's it!** Open [http://localhost:3000](http://localhost:3000) and start building your documentation.

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.17.0 or higher)
- **pnpm** (v8.0.0 or higher) - *Recommended package manager*
- **Git** for version control

### Step-by-Step Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/we-digital/nextra-docs-starter-plus.git
   cd nextra-docs-starter-plus
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   # .env.local
   SESSION_SECRET=your-32-character-secret-key-here
   AUTH_USERNAME=admin
   AUTH_PASSWORD=your-secure-password
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

---

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SESSION_SECRET` | 32-character secret for JWT signing | ✅ | - |
| `AUTH_USERNAME` | Admin username for authentication | ✅ | - |
| `AUTH_PASSWORD` | Admin password for authentication | ✅ | - |
| `NEXT_PUBLIC_APP_URL` | Public URL of your application | ✅ | `http://localhost:3000` |

### Generate Secure Secrets

```bash
# Generate a secure session secret
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 📚 Usage

### Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Build search index
pnpm build:search
```

### Creating Content

1. **Add new pages** in the `content/` directory
2. **Use MDX format** for rich content with React components
3. **Update `_meta.js`** files to configure navigation
4. **Add images** to `public/images/` directory

### Authentication

- Visit `/login` to access the authentication page
- Use the credentials configured in your `.env.local` file
- Protected routes automatically redirect to login when not authenticated

---

## 🏗️ Project Structure

```
nextra-docs-starter-plus/
├── 📁 app/                    # Next.js App Router
│   ├── 📁 [[...mdxPath]]/     # Dynamic MDX routing
│   ├── 📁 login/              # Authentication pages
│   └── 📄 layout.jsx          # Root layout
├── 📁 components/             # React components
├── 📁 content/                # MDX documentation files
│   ├── 📁 installation/       # Installation guides
│   ├── 📁 customization/      # Customization docs
│   └── 📄 index.mdx           # Homepage content
├── 📁 lib/                    # Utility functions
│   ├── 📄 auth-actions.ts     # Authentication logic
│   ├── 📄 session.ts          # Session management
│   └── 📄 theme-config.ts     # Nextra configuration
├── 📁 public/                 # Static assets
├── 📁 styles/                 # CSS stylesheets
└── 📄 next.config.mjs         # Next.js configuration
```

---

## 🎨 Customization

### Theme Configuration

Edit `lib/theme-config.ts` to customize:

- **Logo and branding**
- **Navigation structure**
- **Color scheme**
- **Footer content**
- **Social links**

### Styling

- **Global styles**: `styles/custom.css`
- **Component styles**: Use CSS modules or styled-components
- **Nextra styling**: Leverage built-in utility classes with `nx:` prefix

### Search Configuration

The search functionality is powered by Pagefind and automatically indexes your content. Customize search behavior in `scripts/build-pagefind-pre.js`.

---

## 📖 Documentation

Comprehensive documentation is available at the following locations:

- **[Prerequisites & Quick Start](content/installation/prerequisites.mdx)** - System requirements and setup
- **[Authentication Setup](content/installation/authentication_setup.mdx)** - Complete auth configuration
- **[Creating Content](content/installation/creating_content.mdx)** - Content creation guide
- **[Deployment](content/installation/deployment.mdx)** - Production deployment guides
- **[Customization](content/customization/)** - Theming and styling guides
- **[Troubleshooting](content/troubleshooting.mdx)** - Common issues and solutions

---

## 🤝 Contributing

We welcome contributions to make this template even better! Here's how you can help:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Add tests for new features when applicable
- Update documentation for any changes
- Ensure all tests pass before submitting


## 🐛 Issues & Support

### Reporting Issues

If you encounter any issues, please report them on our [GitHub Issues](https://github.com/we-digital/nextra-docs-starter-plus/issues) page.

When reporting issues, please include:

- **Clear description** of the problem
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Environment details** (OS, Node.js version, browser)
- **Screenshots or logs** if applicable

### Getting Help

- 📖 **Documentation**: Check our comprehensive docs first
- 🐛 **Bug Reports**: Use [GitHub Issues](https://github.com/we-digital//nextra-docs-starter-plus/issues)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Anton Petrushin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👨‍💻 Author

<div align="center">

**Anton Petrushin**

Full Stack Developer | [we:Digital](https://we-digital.studio.com)

[![Website](https://img.shields.io/badge/Website-we:Digital-blue?style=for-the-badge&logo=firefox&logoColor=white)](https://we-digital.studio)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=for-the-badge&logo=github&logoColor=white)](https://github.com/petrushin-ai)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/petrushin)
[![Telegram](https://img.shields.io/badge/Telegram-Contact-blue?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/wedigital)

</div>

---

<div align="center">

**If this project helped you, please consider giving it a ⭐!**

Made with ❤️ by [we:Digital](https://we-digital.studio)

</div>

