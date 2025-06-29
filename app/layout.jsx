import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import Image from 'next/image'
import LogoutButton from '../components/LogoutButton'
import { getSession } from '../lib/session'
import { themeConfig, appConfig } from '../lib/theme-config'
import { headers } from 'next/headers'
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


// Dynamic Theme Style Injection
function ThemeStyleInjector() {
  const { brandPrimary } = themeConfig;
  
  const dynamicStyles = `
    :root {
      --brand-primary: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${brandPrimary.lightness}%);
      --brand-primary-light: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.min(brandPrimary.lightness + 10, 100)}%);
      --brand-primary-dark: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.max(brandPrimary.lightness - 10, 0)}%);
    }
    
    html[class~="dark"] {
      --brand-primary: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.min(brandPrimary.lightness + 10, 100)}%);
      --brand-primary-light: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.min(brandPrimary.lightness + 20, 100)}%);
      --brand-primary-dark: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.max(brandPrimary.lightness - 5, 0)}%);
    }
  `;

  return (
    <style dangerouslySetInnerHTML={{ __html: dynamicStyles }} />
  );
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()
  const session = await getSession()

  const navbarWithAuth = (
    <Navbar
      logo={
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Image 
            src="/images/brand-logo.png" 
            alt="Logo" 
            width={32} 
            height={32} 
            className="app-logo"
          />
          <span className="app-title-text" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
            Nextra Docs Starter+
          </span>
        </div>
      }
      projectLink="https://github.com/we-digital/nextra-docs-starter-plus"
    >
      {session ? (
        <LogoutButton username={session.username} displayName={session.displayName} />
      ) : null}
    </Navbar>
  )

  const footer = (
    <Footer>
      <small>
        © {new Date().getFullYear()} {appConfig.description} v{appConfig.version} by <a href="https://we.digital.studio" target="_blank" rel="noopener noreferrer">we:Digital</a>
      </small>
    </Footer>
  )

  return (
    <html lang="en" suppressHydrationWarning>
      <Head 
        backgroundColor={themeConfig.backgroundColor}
        color={{
          hue: themeConfig.brandPrimary.hue,
          saturation: themeConfig.brandPrimary.saturation
        }}
      />
      <body>
        <ThemeStyleInjector />
        <Banner storageKey="nextra-banner">
          🎉 Nextra Docs Starter + v{appConfig.version} is released. Now with simple session-based auth!
        </Banner>
        
        <Layout
          navbar={navbarWithAuth}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/we-digital/nextra-docs-starter-plus/edit/main"
          editLink="Edit this page on GitHub"
          search={<Search />}
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
} 
