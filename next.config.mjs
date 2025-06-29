import nextra from 'nextra'

const withNextra = nextra({
  defaultShowCopyCode: true,
})

const nextConfig = {
  // Disable development indicators (compilation indicator, route info, etc.)
  devIndicators: false,
  
  // Enable standalone output for Docker production builds
  output: 'standalone',
  
  // Modern Turbopack configuration (replaces experimental.turbo)
  turbopack: {
    // Enable tree shaking for better performance
    // You can add more turbopack options here if needed
    // resolveAlias: {},
    // resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  
  // Optional: Additional Next.js optimizations for Nextra docs
  experimental: {
    // Remove any deprecated experimental.turbo if it exists
    // All turbo-related configs should now be under 'turbopack'
  },
}

export default withNextra(nextConfig)
