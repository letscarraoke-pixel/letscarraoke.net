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
    RUN adduser -D -H -u 10001 appuser && rm -rf /usr/share/nginx/html/*
    
    COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
    COPY --from=builder /app/dist /usr/share/nginx/html
    
    EXPOSE 80
    HEALTHCHECK --interval=30s --timeout=3s --retries=3 CMD wget -qO- http://127.0.0.1/ || exit 1
    
    USER 10001