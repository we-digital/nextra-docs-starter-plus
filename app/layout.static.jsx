import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Image from 'next/image'
// Required for theme styles, previously was imported under the hood
import 'nextra-theme-docs/style.css'
import '../styles/custom.css'

export const metadata = {
  title: {
    default: 'Nextra Docs',
    template: '%s | Nextra Docs'
  },
  description: 'Documentation for Nextra services and APIs'
}

const slackIcon = (
  <svg fill="currentColor" width="26px" height="26px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <title>Slack - Nextra</title>
    <path d="M126.12,315.1A47.06,47.06,0,1,1,79.06,268h47.06Z"/>
    <path d="M149.84,315.1a47.06,47.06,0,0,1,94.12,0V432.94a47.06,47.06,0,1,1-94.12,0Z"/>
    <path d="M196.9,126.12A47.06,47.06,0,1,1,244,79.06v47.06Z"/>
    <path d="M196.9,149.84a47.06,47.06,0,0,1,0,94.12H79.06a47.06,47.06,0,0,1,0-94.12Z"/>
    <path d="M385.88,196.9A47.06,47.06,0,1,1,432.94,244H385.88Z"/>
    <path d="M362.16,196.9a47.06,47.06,0,0,1-94.12,0V79.06a47.06,47.06,0,1,1,94.12,0Z"/>
    <path d="M315.1,385.88A47.06,47.06,0,1,1,268,432.94V385.88Z"/>
    <path d="M315.1,362.16a47.06,47.06,0,0,1,0-94.12H432.94a47.06,47.06,0,1,1,0,94.12Z"/>
  </svg>
)

const logo = (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <Image src="/images/brand-logo.png" alt="Nextra Logo" width={30} height={30} />
    <span className="app-title-text">Nextra Docs</span>
  </div>
)

const navbar = (
  <Navbar 
    logo={logo}
    projectLink="https://github.com/orgs/we-digital/repositories"
  />
)

const footer = (
  <Footer className="flex-col items-center md:items-start">
    Nextra Docs
  </Footer>
)

export default async function RootLayout({ children }) {
  // Static version - no headers() usage, no authentication
  const pageMap = await getPageMap()
  
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <Head 
        backgroundColor={{
          dark: 'rgb(15, 23, 42)',
          light: 'rgb(254, 252, 232)'
        }}
      />
      <body>
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/we-digital/nextra-docs-starter-plus/blob/main"
          editLink="Edit this page on GitHub"
          search={<Search />}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
} 
