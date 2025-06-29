/**
 * Theme Configuration for Nextra Docs
 * 
 * This file centralizes all theme-related settings to make it easy to customize
 * colors and other theme properties throughout the application.
 */

export interface ThemeColors {
  // Custom brand colors (HSL format)
  brandPrimary: {
    hue: number
    saturation: number
    lightness: number
  }
  
  // Background colors for Head component
  backgroundColor: {
    light: string
    dark: string
  }
}

export interface AppConfig {
  name: string
  version: string
  description: string
}

export interface ConfigInterface {
  theme: ThemeColors
  app: AppConfig
}

/**
 * 🎨 CHANGE YOUR THEME COLORS HERE
 * 
 * Modify these values to customize your site's theme:
 * - brandPrimary: Your custom brand color in HSL format (controls primary theme color)
 * - backgroundColor: Background colors for different modes
 */
export const themeConfig: ThemeColors = {
  // 🔵 Blue theme (current)
  brandPrimary: {
    hue: 148,        // Blue hue (0-360)
    saturation: 79,  // 79% saturation
    lightness: 46    // 46% lightness
  },
  
  backgroundColor: {
    light: 'rgb(254, 252, 232)', // Warm cream
    dark: 'rgb(15, 23, 42)'       // Dark slate
  }
}

/**
 * 📱 APP CONFIGURATION
 * 
 * Configure your app-level settings here:
 * - name: Application display name
 * - version: Current version (update this when releasing new versions)
 * - description: App description
 */
export const appConfig: AppConfig = {
  name: 'Nextra Docs Starter Kit',
  version: '1.0.0',
  description: 'Nextra docs Starter kit with simple authentication'
}

/**
 * 🔧 COMPLETE CONFIGURATION
 * 
 * Combined configuration object with all settings
 */
export const config: ConfigInterface = {
  theme: themeConfig,
  app: appConfig
}

/**
 * 🎨 ALTERNATIVE COLOR SCHEMES
 * 
 * Uncomment one of these to try different themes:
 */

// 🟢 Green theme
// export const themeConfig: ThemeColors = {
//   brandPrimary: { hue: 142, saturation: 71, lightness: 45 },
//   backgroundColor: {
//     light: 'rgb(240, 253, 244)',
//     dark: 'rgb(3, 25, 9)'
//   }
// }

// 🟣 Purple theme  
// export const themeConfig: ThemeColors = {
//   brandPrimary: { hue: 259, saturation: 94, lightness: 51 },
//   backgroundColor: {
//     light: 'rgb(250, 245, 255)',
//     dark: 'rgb(23, 15, 42)'
//   }
// }

// 🔴 Red theme
// export const themeConfig: ThemeColors = {
//   brandPrimary: { hue: 348, saturation: 89, lightness: 46 },
//   backgroundColor: {
//     light: 'rgb(254, 242, 242)',
//     dark: 'rgb(42, 15, 23)'
//   }
// }

// 🟠 Orange theme
// export const themeConfig: ThemeColors = {
//   brandPrimary: { hue: 25, saturation: 95, lightness: 53 },
//   backgroundColor: {
//     light: 'rgb(255, 247, 237)',
//     dark: 'rgb(42, 25, 15)'
//   }
// }

/**
 * Helper function to generate CSS custom properties from theme config
 */
export function generateThemeCSS(config: ThemeColors): string {
  const { brandPrimary } = config
  
  return `
    :root {
      --brand-primary: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${brandPrimary.lightness}%);
      --brand-primary-light: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.min(brandPrimary.lightness + 10, 90)}%);
      --brand-primary-dark: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.max(brandPrimary.lightness - 10, 10)}%);
    }
    
    html[class~="dark"] {
      --brand-primary: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.min(brandPrimary.lightness + 10, 90)}%);
      --brand-primary-light: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.min(brandPrimary.lightness + 20, 95)}%);
      --brand-primary-dark: hsl(${brandPrimary.hue}, ${brandPrimary.saturation}%, ${Math.max(brandPrimary.lightness - 5, 15)}%);
    }
  `
}

/**
 * Get theme configuration for use in components
 */
export function getThemeConfig(): ThemeColors {
  return themeConfig
} 