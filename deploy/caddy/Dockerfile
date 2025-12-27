FROM caddy:builder AS builder

# Build Caddy with JA3 plugin
RUN xcaddy build \
    --with github.com/rushiiMachine/caddy-ja3

FROM caddy:latest

# Copy the custom Caddy binary
COPY --from=builder /usr/bin/caddy /usr/bin/caddy
