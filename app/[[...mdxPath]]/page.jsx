import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { notFound, redirect } from 'next/navigation'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

const Wrapper = getMDXComponents().wrapper

// Paths that should not be processed as MDX content
const EXCLUDED_PATHS = [
  '.well-known',
  'favicon.ico',
  'robots.txt',
  'sitemap.xml',
  '_next',
  '_pagefind',
  'api'
]

export default async function Page(props) {
  const params = await props.params
  const mdxPath = params.mdxPath || []
  
  // Check if authentication is enabled
  const authEnabled = process.env.AUTH_ENABLED !== 'false'
  
  // Check if this path should be excluded from MDX processing
  if (mdxPath.length > 0 && EXCLUDED_PATHS.includes(mdxPath[0])) {
    if (!authEnabled) {
      redirect('/')
    }
    notFound()
  }
  
  try {
    const result = await importPage(mdxPath)
    const { default: MDXContent, toc, metadata } = result
    
    if (Wrapper) {
      return (
        <Wrapper toc={toc} metadata={metadata}>
          <MDXContent {...props} params={params} />
        </Wrapper>
      )
    }
    
    return <MDXContent {...props} params={params} />
  } catch (error) {
    // Log the error for debugging but don't crash the app
    console.warn('Failed to load MDX page:', mdxPath, error.message)
    
    // When auth is disabled, redirect non-existing pages to home
    if (!authEnabled) {
      redirect('/')
    }
    
    notFound()
  }
} 