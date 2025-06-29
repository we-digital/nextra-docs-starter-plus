import nextra from 'nextra'
import path from 'path'

const withNextra = nextra({
  defaultShowCopyCode: true,
})

const nextConfig = {
  // Enable static export for Pagefind indexing
  output: 'export',
  
  // Disable features that don't work with static export
  images: {
    unoptimized: true
  },
  
  // Disable development indicators
  devIndicators: false,
  
  // Modern Turbopack configuration
  turbopack: {
    // Enable tree shaking for better performance
  },
  
  // Webpack configuration to replace Server Actions with static versions
  webpack: (config, { isServer }) => {
    // Replace auth-actions with static version for static export
    config.resolve.alias = {
      ...config.resolve.alias,
      [path.resolve('./lib/auth-actions.ts')]: path.resolve('./lib/auth-actions.static.ts'),
    }
    
    return config
  },
}

export default withNextra(nextConfig) 