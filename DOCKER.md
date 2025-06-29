# Docker Setup for Nextra Documentation

This guide explains how to run your Nextra documentation app using Docker with hot reload support for development and optimized builds for production.

## Prerequisites

- Docker Desktop installed
- Docker Compose v2 (comes with Docker Desktop)

## Quick Start

### Development Environment (with Hot Reload)

**🚨 Important**: This project uses **pnpm**, so the Dockerfile is optimized for pnpm instead of npm.

Run the development environment with hot reload enabled:

```bash
npm run docker:dev
# or with pnpm
pnpm run docker:dev
```

Or manually:
```bash
docker-compose -f docker-compose.dev.yml up --build
```

The application will be available at `http://localhost:3000` with:
- ✅ Hot reload for all file changes  
- ✅ Volume mounting for `app`, `components`, `content`, `lib`, `public`, `scripts`, `styles`
- ✅ Fast refresh and live reloading
- ✅ Source maps for debugging
- ✅ pnpm package manager for faster installs

### Production Environment

Run the production build:

```bash
npm run docker:prod
```

Or manually:
```bash
docker-compose -f docker-compose.prod.yml up --build
```

## File Structure

```
nextra-docs-starter-plus/
├── Dockerfile                    # Multi-stage Docker build
├── docker-compose.dev.yml        # Development environment
├── docker-compose.prod.yml       # Production environment
├── .dockerignore                 # Files to exclude from build
├── app/                          # Mounted as volume in dev
├── components/                   # Mounted as volume in dev
├── content/                      # Mounted as volume in dev
├── lib/                          # Mounted as volume in dev
├── public/                       # Mounted as volume in dev
├── scripts/                      # Mounted as volume in dev
├── styles/                       # Mounted as volume in dev
└── ...
```

## Volume Mounting Strategy

The Docker setup uses the following volume mounting strategy:

### Development (Hot Reload)
- **Source Code Mount**: `.:/app` - Your entire project is mounted as a volume
- **Node Modules Preservation**: `/app/node_modules` - Prevents overwriting container's node_modules
- **Build Cache**: `/app/.next` - Preserves Next.js build cache for faster rebuilds

### Environment Variables for Hot Reload
- `WATCHPACK_POLLING=true` - Enables polling for file changes (required for Docker)
- `CHOKIDAR_USEPOLLING=true` - Backup polling mechanism for file watching

## Available Commands

### Docker Compose Commands
```bash
# Development
npm run docker:dev           # Start development environment
npm run docker:dev:down      # Stop development environment

# Production  
npm run docker:prod          # Start production environment
npm run docker:prod:down     # Stop production environment
```

### Direct Docker Commands
```bash
# Build images directly
npm run docker:build:dev     # Build development image
npm run docker:build:prod    # Build production image

# Run containers directly
docker run -p 3000:3000 nextra-docs:dev
docker run -p 3000:3000 nextra-docs:prod
```

## Multi-Stage Build Explanation

The Dockerfile uses a multi-stage build with the following stages:

1. **base** - Common Node.js Alpine setup
2. **deps** - Install and cache dependencies
3. **development** - Development environment with all dependencies
4. **builder** - Build the application for production
5. **production** - Minimal production runtime with only necessary files

## File Watching & Hot Reload

The development setup enables hot reload through:

1. **Volume Mounting**: Source code is mounted from host to container
2. **Polling**: `WATCHPACK_POLLING=true` enables file change detection in Docker
3. **Preserved Dependencies**: Node modules stay in container for performance
4. **Build Cache**: Next.js cache is preserved for faster rebuilds

## Performance Optimizations

### Development
- Dependencies are installed once and preserved in container
- Build cache is maintained across restarts
- Polling is optimized for reasonable performance vs. responsiveness

### Production
- Multi-stage build reduces final image size
- Only production dependencies included
- Standalone output for optimal deployment
- Non-root user for security
- Health checks for reliability

## Troubleshooting

### Hot Reload Not Working
1. Ensure `WATCHPACK_POLLING=true` is set in environment
2. Check that volumes are properly mounted
3. Verify Docker has access to your project directory

### Slow Performance
1. Ensure you're not mounting `node_modules` from host
2. Consider increasing Docker Desktop resource allocation
3. Use bind mounts instead of volumes for better performance on Windows/Mac

### Build Failures
1. Check `.dockerignore` includes appropriate exclusions
2. Ensure all required files are copied in Dockerfile
3. Verify standalone output is enabled in `next.config.mjs`

### Port Conflicts
If port 3000 is already in use, modify the port mapping in docker-compose files:
```yml
ports:
  - "3001:3000"  # Use port 3001 instead
```

## Best Practices

1. **Use the development setup** for coding with hot reload
2. **Test production builds** before deployment
3. **Keep dependencies up to date** in both package.json and Dockerfile
4. **Monitor resource usage** during development
5. **Use .dockerignore** to exclude unnecessary files from build context

## Environment Variables

You can add environment variables to your `.env.local` file and they will be available in the container. For Docker-specific variables, add them to the docker-compose files:

```yml
environment:
  - NODE_ENV=development
  - CUSTOM_VAR=value
  - WATCHPACK_POLLING=true
```

## Why pnpm Instead of npm?

This project uses **pnpm** as the package manager, which offers several advantages:

### Performance Benefits
- **Faster installs**: pnpm reuses packages across projects via hard links
- **Disk efficiency**: Significantly less disk space usage
- **Parallel installs**: Better parallelization than npm

### Docker-Specific Advantages  
- **Deterministic builds**: `pnpm install --frozen-lockfile` is equivalent to `npm ci`
- **Better caching**: More efficient layer caching in Docker builds
- **Consistent dependencies**: Strict package resolution prevents phantom dependencies

### Migration from npm to pnpm
If you want to switch to npm instead:

1. **Delete pnpm files**:
   ```bash
   rm pnpm-lock.yaml .npmrc
   ```

2. **Generate npm lockfile**:
   ```bash
   npm install
   ```

3. **Update Dockerfile** to use npm:
   ```dockerfile
   # Replace pnpm commands with npm
   RUN npm ci --production
   CMD ["npm", "run", "dev"]
   ```

## Need Help?

- Check Docker Desktop is running
- Verify Docker Compose v2 is available
- Ensure your project files are not in restricted directories
- Check Docker Desktop file sharing settings on Windows/Mac

**🚨 Having connection issues?** See [DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md) for detailed troubleshooting steps. 