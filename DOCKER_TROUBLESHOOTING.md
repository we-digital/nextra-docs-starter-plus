# Docker Troubleshooting Guide

## Issue: "unable to get image" and Docker pipe connection error

### Error Message
```
unable to get image 'nextra-docs-starter-plus-nextra-dev': error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.47/images/nextra-docs-starter-plus-nextra-dev/json": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

### Root Cause
This error typically occurs when:
1. Docker Desktop is not running or not fully started
2. Missing Windows features (Containers, Hyper-V)
3. WSL2 vs Hyper-V backend conflicts
4. BitLocker/FVE registry policy blocking containers
5. Docker Engine service not running
6. Missing named pipes in Windows

## Solution Steps

### Step 1: Critical - Start Docker Desktop First!
⚠️ **Most common mistake**: Running Docker commands before Docker Desktop is started

1. **Always start Docker Desktop application first:**
   - Search "Docker Desktop" in Start menu and launch it
   - **WAIT** for it to fully load (icon stops spinning)
   - Look for "Docker Desktop is running" message

2. **THEN try your Docker commands:**
   ```bash
   # Only after Docker Desktop is running
   npm run docker:dev
   ```

3. **Check Docker Desktop status:**
   - Right-click Docker icon → Should show "Docker Desktop is running"
   - If still loading, wait longer before running commands

### Step 2: Enable Required Windows Features
🔧 **Critical Fix**: Many users solved this by enabling missing Windows features

**Option A: Using PowerShell (Recommended - Run as Administrator):**
```powershell
# Enable both Containers and Hyper-V features
Enable-WindowsOptionalFeature -Online -FeatureName $("Microsoft-Hyper-V", "Containers") -All
```

**Option B: Using Windows Features GUI:**
1. Press `Win + R` → type `appwiz.cpl` → Enter
2. Click "Turn Windows features on or off"
3. Check these boxes:
   - ✅ **Containers**
   - ✅ **Hyper-V** (if available on your Windows edition)
   - ✅ **Windows Subsystem for Linux**
   - ✅ **Virtual Machine Platform**
4. Click OK and **restart your computer**

**After restart, verify Docker installation:**
```bash
# Check Docker version
docker --version

# Check Docker Compose version
docker compose version

# Test Docker connectivity
docker info
```

### Step 3: Fix BitLocker Registry Policy (Critical Fix!)
🚨 **This registry fix solved the issue for many users**

**Run as Administrator in PowerShell:**
```powershell
# Check if the problematic registry key exists
Get-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Policies\Microsoft\FVE" -Name "FDVDenyWriteAccess" -ErrorAction SilentlyContinue

# If it exists and is set to 1, change it to 0
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Policies\Microsoft\FVE" -Name "FDVDenyWriteAccess" -Value 0
```

**Manual Registry Edit (Alternative):**
1. Press `Win + R` → type `regedit` → Enter (Run as Administrator)
2. Navigate to: `Computer\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Policies\Microsoft\FVE`
3. Find `FDVDenyWriteAccess` and set its value to `0`
4. Restart Docker Desktop

### Step 4: Switch Docker Backend (WSL2 vs Hyper-V)
💡 **Many users fixed this by switching backends**

**In Docker Desktop Settings:**
1. Right-click Docker icon → Settings
2. Go to "General"
3. **Try toggling**: "Use WSL 2 instead of Hyper-V"
   - If checked → Uncheck it (use Hyper-V)
   - If unchecked → Check it (use WSL2)
4. Apply & Restart Docker Desktop

**If using WSL2, check integration:**
- Go to "Resources" → "WSL Integration"
- Ensure WSL2 is enabled
- Enable integration with your WSL distro

**Restart WSL (if needed):**
```bash
# In PowerShell as Administrator
wsl --shutdown
wsl
```

### Step 5: Check Windows Services
🔍 **Critical Check**: Verify Docker services are running

**Option A: Using Services GUI:**
1. Press `Win + R` → type `services.msc` → Enter
2. Look for these services and ensure they're **Running**:
   - ✅ **Docker Desktop Service**
   - ✅ **Docker Engine** (if exists)
3. If stopped, right-click → Start

**Option B: Using PowerShell (Run as Administrator):**
```powershell
# Check Docker service status
Get-Service | Where-Object {$_.Name -like "*docker*"}

# Start Docker services if needed
Start-Service "Docker Desktop Service"

# Restart all Docker services
Restart-Service "Docker Desktop Service"
```

**Check Named Pipes (Advanced):**
```powershell
# List all Docker-related pipes
[System.IO.Directory]::GetFiles("\\.\pipe\") | Select-String docker

# Should see pipes like:
# \\.\pipe\docker_engine
# \\.\pipe\dockerDesktopLinuxEngine
# \\.\pipe\dockerDesktopWindowsEngine
```

### Step 5: Alternative Docker Commands
Try these commands to test Docker connectivity:

```bash
# Simple test
docker run hello-world

# List running containers
docker ps

# List all containers
docker ps -a
```

## Quick Fix Commands (Try These First!)

### 🚀 Most Common Solution (90% of cases)
```bash
# 1. Start Docker Desktop application (search in Start menu)
# 2. WAIT for it to fully load (whale icon stops spinning)
# 3. THEN run your command:
npm run docker:dev
```

### 🔧 Enable Windows Features (if above doesn't work)
```powershell
# Run as Administrator
Enable-WindowsOptionalFeature -Online -FeatureName $("Microsoft-Hyper-V", "Containers") -All
# Restart computer after this
```

### 🛠️ Registry Fix (for persistent issues)
```powershell
# Run as Administrator
Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Policies\Microsoft\FVE" -Name "FDVDenyWriteAccess" -Value 0
```

### For Development Environment
```bash
# Only after Docker Desktop is fully running:
npm run docker:dev

# Or manually with more verbose output:
docker-compose -f docker-compose.dev.yml up --build --verbose
```

### If Still Not Working
1. **Restart Docker Desktop completely:**
   - Close Docker Desktop
   - End all Docker processes in Task Manager
   - Restart Docker Desktop
   - Wait for it to fully load

2. **Reset Docker Desktop (last resort):**
   - Docker Desktop Settings → "Troubleshoot" → "Reset to factory defaults"
   - **Warning:** This will remove all containers and images

## Windows-Specific Issues

### Hyper-V Conflicts
If you have VirtualBox or other virtualization software:
```bash
# Disable Hyper-V (requires restart)
bcdedit /set hypervisorlaunchtype off

# Re-enable Hyper-V (requires restart)
bcdedit /set hypervisorlaunchtype auto
```

### Windows Features
Ensure these Windows features are enabled:
- Windows Subsystem for Linux
- Virtual Machine Platform
- Hyper-V (for Windows Pro/Enterprise)

## Testing the Fix

After resolving Docker connectivity, test with a simple command:

```bash
# Test Docker
docker run --rm alpine echo "Docker is working!"

# Test Docker Compose
docker compose --help

# Try your development environment
npm run docker:dev
```

## Expected Success Output

When working correctly, you should see:
```bash
> docker-compose -f docker-compose.dev.yml up --build

[+] Building 0.5s (12/12) FINISHED
[+] Running 1/1
 ✔ Container nextra-docs-dev  Created
 ✔ Container nextra-docs-dev  Started

nextra-docs-dev  | Ready - started server on 0.0.0.0:3000
```

## Still Having Issues?

1. **Check Docker Desktop logs:**
   - Docker Desktop → Troubleshoot → View logs

2. **Try Docker Desktop Diagnostic:**
   - Docker Desktop → Troubleshoot → Run diagnostics

3. **Reinstall Docker Desktop:**
   - Download latest version from docker.com
   - Uninstall current version
   - Install fresh copy

4. **Contact Support:**
   - Check Docker Desktop GitHub issues
   - Docker Community forums
   - Windows Docker documentation

## ✅ Proven Solutions from Real Users

Based on the Docker forums and GitHub issues, here are the **exact solutions that worked**:

### Solution 1: Just Start Docker Desktop (Most Common)
> "I figured out my problem. I didn't run docker desktop first… i was just trying to run docker commands after installation. running docker desktop created the VM and all is well" - Docker Forums

**Fix**: Always start Docker Desktop **before** running any `docker` commands.

### Solution 2: Enable Windows Features (Very Common)
> "Enable-WindowsOptionalFeature -Online -FeatureName $("Microsoft-Hyper-V", "Containers") -All" - Docker Forums

**Fix**: Enable Windows Containers and Hyper-V features via PowerShell as Administrator.

### Solution 3: BitLocker Registry Fix (Advanced)
> "Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Policies\Microsoft\FVE' -Name 'FDVDenyWriteAccess' -Value 0" - Docker Forums

**Fix**: Modify BitLocker registry settings that can block container access.

### Solution 4: Restart Docker Services
**Fix**: Restart Docker Desktop Service via Services management console.

---

## 🚨 NEW: npm ci vs pnpm Error Fix

### Error: "npm ci can only install with existing package-lock.json"

**Root Cause**: Your project uses **pnpm** (`pnpm-lock.yaml` exists) but the Dockerfile tries to run **npm ci** which requires `package-lock.json`.

**Solutions**:

#### Option A: Update Dockerfile to Use pnpm (Recommended)
```dockerfile
# Use pnpm instead of npm
FROM node:18-alpine AS base
RUN npm install -g pnpm
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
```

#### Option B: Generate package-lock.json
```bash
# Delete pnpm-lock.yaml and generate npm lockfile
rm pnpm-lock.yaml
npm install
# This creates package-lock.json
```

#### Option C: Use npm install instead of npm ci
```dockerfile
# Change from npm ci to npm install
RUN npm install --production
```

### Error: "Lockfile not compatible with current pnpm"

**Root Cause**: pnpm version mismatch between local and Docker container.

**Solutions**:

#### Option A: Pin pnpm version in Dockerfile
```dockerfile
# Install specific pnpm version compatible with your lockfile
RUN npm install -g pnpm@7  # For lockfileVersion 6.0
RUN npm install -g pnpm@8  # For lockfileVersion 9.0
```

#### Option B: Update local pnpm lockfile
```bash
# Update to latest pnpm and regenerate lockfile
pnpm --version
pnpm install
```

#### Option C: Use --force (not recommended for production)
```dockerfile
RUN pnpm install --frozen-lockfile --force
```