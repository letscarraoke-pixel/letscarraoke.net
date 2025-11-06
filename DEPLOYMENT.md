# Deployment Guide for Coolify

This guide contains all the necessary configuration files and instructions for deploying the Let's Car'raoke application to Coolify.

## Overview

This application is an Astro static site that uses:
- **Bun** for package management and building
- **Nginx** for serving static files
- **Docker** for containerization
- **Coolify** for deployment orchestration

## Configuration Files

### Dockerfile

The Dockerfile uses a multi-stage build process:

```dockerfile
# ---- Builder ----
FROM oven/bun:1.1-alpine AS builder
WORKDIR /app

# Copy project files
COPY . .

# Install and build using Bun
RUN bun install --frozen-lockfile || bun install
RUN bun run build

# ---- Runtime ----
FROM nginx:1.27-alpine
RUN rm -rf /usr/share/nginx/html/*

COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ || exit 1
```

**Key Points:**
- Builder stage uses `oven/bun:1.1-alpine` to install dependencies and build the Astro site
- Runtime stage uses `nginx:1.27-alpine` for serving static files
- Build output (`/app/dist`) is copied to Nginx's HTML directory
- Health check ensures the container is running correctly

### docker-compose.yaml

```yaml
version: "3.9"
services:
  web:
    build: .
    # For local testing; Coolify will map ports automatically in its UI
    # Port mapping removed for Coolify deployment - it handles ports via its UI
    # For local testing, uncomment the ports line below:
    # ports:
    #   - "8080:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

**Key Points:**
- Port mapping is commented out because Coolify handles port mapping through its UI
- Environment variable `NODE_ENV=production` is set for production builds
- Service restarts automatically unless stopped manually

### nginx.conf

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # SPA fallback - serve index.html for non-file routes
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets for performance
  location ~* \.(?:css|js|mjs|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2)$ {
    expires 30d;
    access_log off;
    try_files $uri =404;
  }

  # Basic gzip
  gzip on;
  gzip_comp_level 5;
  gzip_min_length 256;
  gzip_types text/plain text/css application/json application/javascript application/xml image/svg+xml;
}
```

**Key Points:**
- Listens on port 80 (standard HTTP port)
- SPA fallback configuration ensures `index.html` is served for all routes
- Static assets are cached for 30 days for better performance
- Gzip compression is enabled for text-based files

## Coolify Deployment Settings

### Application Configuration

When setting up the application in Coolify:

1. **Application Type**: Docker Compose
2. **Repository**: Your Git repository URL
3. **Build Pack**: Use the provided `docker-compose.yaml` file

### Port Configuration

- **Container Port**: `80` (Nginx listens on port 80)
- **Public Port**: Coolify will automatically assign a public port (you can configure this in Coolify's UI)

### Environment Variables

Set the following environment variables in Coolify:

- `NODE_ENV=production` (already in docker-compose.yaml, but can be overridden in Coolify UI)

### Build Settings

- **Build Command**: Not needed (Docker handles building)
- **Docker Context**: Root directory (`.`)
- **Dockerfile**: Uses the `Dockerfile` in the root directory

### Health Check

The Dockerfile includes a health check that:
- Runs every 30 seconds
- Times out after 3 seconds
- Retries 3 times before marking as unhealthy
- Checks `http://127.0.0.1/` endpoint

## Deployment Steps

1. **Prepare Repository**
   - Ensure all files (`Dockerfile`, `docker-compose.yaml`, `deploy/nginx.conf`) are committed to your repository
   - Push changes to your Git repository

2. **Create Application in Coolify**
   - Navigate to Coolify dashboard
   - Click "New Application"
   - Select "Docker Compose" as the application type
   - Connect your Git repository

3. **Configure Application**
   - Coolify will detect the `docker-compose.yaml` file automatically
   - Review the detected configuration
   - Set any additional environment variables if needed

4. **Deploy**
   - Click "Deploy" or "Save & Deploy"
   - Monitor the build logs in Coolify
   - Wait for the deployment to complete

5. **Verify Deployment**
   - Check the health status in Coolify dashboard
   - Visit the assigned public URL
   - Verify the application loads correctly

## Local Testing

To test the Docker setup locally before deploying:

```bash
# Build the Docker image
docker build -t lets-car-raoke .

# Run using docker-compose (uncomment ports in docker-compose.yaml first)
docker-compose up

# Or run directly with Docker
docker run -p 8080:80 lets-car-raoke
```

Then visit `http://localhost:8080` in your browser.

## Troubleshooting

### Build Issues

- **Bun install fails**: The Dockerfile includes a fallback (`|| bun install`) if `--frozen-lockfile` fails
- **Build output not found**: Ensure `astro.config.mjs` has `output: 'static'` configured

### Runtime Issues

- **404 errors on routes**: Verify `nginx.conf` has the SPA fallback configuration (`try_files $uri $uri/ /index.html;`)
- **Static assets not loading**: Check that assets are in the `/dist` directory after build
- **Health check failing**: Ensure the container is running and Nginx is accessible on port 80

### Coolify-Specific Issues

- **Port conflicts**: Coolify manages ports automatically - ensure port mapping is commented out in `docker-compose.yaml`
- **Build logs**: Check Coolify's build logs for detailed error messages
- **Environment variables**: Verify environment variables are set correctly in Coolify's UI

## File Structure

```
lets-car-raoke/
├── Dockerfile              # Multi-stage Docker build configuration
├── docker-compose.yaml     # Docker Compose configuration for Coolify
├── deploy/
│   └── nginx.conf         # Nginx server configuration
├── astro.config.mjs       # Astro configuration (output: static)
└── package.json           # Project dependencies and scripts
```

## Additional Notes

- The application builds as a static site (`output: 'static'` in `astro.config.mjs`)
- All static files are served by Nginx after the build completes
- The health check ensures container reliability
- Gzip compression improves performance for text-based assets
- Static assets are cached for 30 days to reduce server load

