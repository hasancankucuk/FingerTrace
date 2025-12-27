FROM debian:bullseye-slim AS builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpcre3 \
    libpcre3-dev \
    zlib1g \
    zlib1g-dev \
    git \
    wget \
    perl \
    libssl-dev \
    ca-certificates

WORKDIR /build

# 1. Get JA3 Module
RUN git clone https://github.com/fooinha/nginx-ssl-ja3.git

# 2. Get OpenSSL 1.1.1w (Best stability for JA3 patches)
ENV OPENSSL_VERSION=1.1.1w
RUN wget https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz && \
    tar -zxvf openssl-${OPENSSL_VERSION}.tar.gz

# 3. Get Nginx 1.25.3
ENV NGINX_VERSION=1.25.3
RUN wget https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar -zxvf nginx-${NGINX_VERSION}.tar.gz

# 4. Patch OpenSSL
WORKDIR /build/openssl-${OPENSSL_VERSION}
# Apply the OpenSSL 1.1.1 patch from the repo using find to be robust
RUN patch -p1 < $(find /build/nginx-ssl-ja3/patches -name "openssl-1.1.1*.patch" | head -n 1)

# 5. Compile Nginx
WORKDIR /build/nginx-${NGINX_VERSION}
# Apply the Nginx patch
RUN patch -p1 < $(find /build/nginx-ssl-ja3/patches -name "nginx*.patch" | head -n 1)

RUN ./configure \
    --prefix=/etc/nginx \
    --sbin-path=/usr/sbin/nginx \
    --modules-path=/usr/lib/nginx/modules \
    --conf-path=/etc/nginx/nginx.conf \
    --pid-path=/var/run/nginx.pid \
    --lock-path=/var/run/nginx.lock \
    --with-openssl=/build/openssl-${OPENSSL_VERSION} \
    --add-module=/build/nginx-ssl-ja3 \
    --with-http_ssl_module \
    --with-http_v2_module \
    --with-http_realip_module \
    --with-stream_ssl_module \
    --with-cc-opt="-I/usr/include" \
    --with-ld-opt="-L/usr/lib"

RUN make -j$(nproc) && make install

# Final Stage
FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y \
    libpcre3 \
    zlib1g \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/sbin/nginx /usr/sbin/nginx
COPY --from=builder /etc/nginx /etc/nginx
# Copy modules if any were built
COPY --from=builder /usr/lib/nginx/modules /usr/lib/nginx/modules

# Log redirection
RUN mkdir -p /var/log/nginx && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
