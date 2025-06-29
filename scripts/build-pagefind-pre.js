#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// File backup configuration - we'll work in a temporary directory
const TEMP_DIR = '.pagefind-temp';
const FILE_CONFIGS = [
  {
    name: 'config',
    original: 'next.config.mjs',
    static: 'next.config.pagefind.mjs'
  },
  {
    name: 'auth-actions',
    original: 'lib/auth-actions.ts',
    static: 'lib/auth-actions.static.ts'
  },
  {
    name: 'session',
    original: 'lib/session.ts',
    static: 'lib/session.static.ts'
  },
  {
    name: 'layout',
    original: 'app/layout.jsx',
    static: 'app/layout.static.jsx'
  }
];

function createTempBuildDirectory() {
  console.log('📁 Creating temporary build directory...');
  
  // Clean up any existing temp directory
  if (fs.existsSync(TEMP_DIR)) {
    try {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true, maxRetries: 3 });
    } catch (error) {
      console.warn('⚠ Could not clean existing temp directory:', error.message);
      // Try to continue anyway
    }
  }
  
  // Create new temp directory
  fs.mkdirSync(TEMP_DIR, { recursive: true });
  
  // Copy entire project to temp directory, excluding node_modules and build artifacts
  const excludeDirs = [
    'node_modules', 
    '.next', 
    'out', 
    '.git', 
    '.pagefind-build',
    'pagefind-html',
    'public/_pagefind'
  ];
  
  const copyRecursive = (src, dest) => {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      const dirName = path.basename(src);
      if (excludeDirs.includes(dirName)) {
        return; // Skip excluded directories
      }
      
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const items = fs.readdirSync(src);
      items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        copyRecursive(srcPath, destPath);
      });
    } else {
      fs.copyFileSync(src, dest);
    }
  };
  
  console.log('📋 Copying project files to temp directory...');
  const items = fs.readdirSync('.');
  items.forEach(item => {
    if (!excludeDirs.includes(item) && !item.startsWith('.')) {
      const srcPath = path.join('.', item);
      const destPath = path.join(TEMP_DIR, item);
      copyRecursive(srcPath, destPath);
    }
  });
  
  // Copy essential dotfiles
  const dotFiles = ['.env.local', '.env', '.npmrc'];
  dotFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join(TEMP_DIR, file));
    }
  });
  
  console.log('✓ Temporary build directory created');
}

function replaceFilesInTempDir() {
  console.log('🔄 Replacing files with static versions in temp directory...');
  
  for (const config of FILE_CONFIGS) {
    try {
      const originalPath = path.join(TEMP_DIR, config.original);
      const staticPath = path.join('.', config.static); // Static files are in root
      
      if (fs.existsSync(staticPath)) {
        fs.copyFileSync(staticPath, originalPath);
        console.log(`   ✓ Replaced ${config.name} with static version`);
      } else {
        console.warn(`   ⚠ Static version not found: ${staticPath}`);
      }
    } catch (error) {
      console.error(`   ❌ Error replacing ${config.name}:`, error.message);
      throw error;
    }
  }
}

function buildStaticExportInTempDir() {
  console.log('📦 Building static export in temp directory...');
  
  const originalCwd = process.cwd();
  
  try {
    // Change to temp directory
    process.chdir(TEMP_DIR);
    
    // Install dependencies using npm install (faster than copying)
    console.log('📦 Installing dependencies in temp directory...');
    execSync('npm install --production --silent', { 
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    // Build static export
    execSync('npx next build', { 
      stdio: 'inherit',
      env: { ...process.env, NEXT_EXPORT: 'true' }
    });
    
    console.log('✓ Static export built successfully');
    
  } finally {
    // Always change back to original directory
    process.chdir(originalCwd);
  }
}

function runPagefindIndexing() {
  console.log('🔎 Running Pagefind indexing...');
  
  const outDir = path.join(TEMP_DIR, 'out');
  
  if (!fs.existsSync(outDir)) {
    throw new Error('Static export output directory not found');
  }
  
  // Check for HTML files
  const htmlFiles = [];
  const checkDir = (dir, prefix = '') => {
    const items = fs.readdirSync(dir);
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        checkDir(fullPath, `${prefix}${item}/`);
      } else if (item.endsWith('.html')) {
        htmlFiles.push(`${prefix}${item}`);
      }
    });
  };
  
  checkDir(outDir);
  console.log(`📄 Found ${htmlFiles.length} HTML files for indexing`);
  
  if (htmlFiles.length === 0) {
    console.warn('⚠ No HTML files found for indexing');
    return;
  }
  
  // Ensure public directory exists
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public', { recursive: true });
  }
  
  // Run Pagefind
  execSync(`npx pagefind --site ${outDir} --output-path public/_pagefind`, { 
    stdio: 'inherit' 
  });
  
  console.log('✓ Pagefind indexing completed');
}

function cleanup() {
  console.log('🧹 Cleaning up temporary files...');
  
  if (fs.existsSync(TEMP_DIR)) {
    try {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true, maxRetries: 3 });
      console.log('✓ Temporary directory cleaned up');
    } catch (error) {
      console.warn('⚠ Could not fully clean up temporary directory:', error.message);
      // Don't fail the build for cleanup issues
    }
  }
}

async function buildPagefindIndex() {
  console.log('🔍 Building Pagefind index (pre-build)...');
  
  try {
    // Step 1: Create temporary build directory with project files
    createTempBuildDirectory();
    
    // Step 2: Replace files with static versions in temp directory
    replaceFilesInTempDir();
    
    // Step 3: Build static export in temp directory
    buildStaticExportInTempDir();
    
    // Step 4: Run Pagefind indexing
    runPagefindIndexing();
    
    // Step 5: Clean up
    cleanup();
    
    console.log('✅ Pagefind index built successfully (ready for main build)!');
    
  } catch (error) {
    console.error('❌ Error building Pagefind index:', error.message);
    
    // Ensure cleanup even on error
    cleanup();
    
    process.exit(1);
  }
}

buildPagefindIndex(); 