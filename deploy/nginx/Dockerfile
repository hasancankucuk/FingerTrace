FROM ubuntu:22.04 AS builder

# Check updates
RUN apt-get update && apt-get install -y \
    build-essential \
    libpcre3 \
    libpcre3-dev \
    zlib1g \
    zlib1g-dev \
    git \
    wget \
    perl \
    libssl-dev

WORKDIR /build

# 1. Get JA3 Module
RUN git clone https://github.com/fooinha/nginx-ssl-ja3.git

# 2. Get OpenSSL (Updated for JA3 module requirements)
ENV OPENSSL_VERSION=3.3.2
RUN wget https://www.openssl.org/source/openssl-${OPENSSL_VERSION}.tar.gz && \
    tar -zxvf openssl-${OPENSSL_VERSION}.tar.gz

# 3. Get Nginx
ENV NGINX_VERSION=1.25.3
RUN wget https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz && \
    tar -zxvf nginx-${NGINX_VERSION}.tar.gz

# 4. Patch OpenSSL
WORKDIR /build/openssl-${OPENSSL_VERSION}
# Use the OpenSSL 3 extensions patch from the repo
RUN patch -p1 < /build/nginx-ssl-ja3/patches/openssl-3.extensions.patch

# 5. Compile Nginx
WORKDIR /build/nginx-${NGINX_VERSION}
# Find and apply the Nginx patch (usually nginx.patch or similar)
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
    --with-stream_ssl_module 

RUN make -j$(nproc) && make install

# Final Stage
FROM ubuntu:22.04

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpcre3 \
    zlib1g \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/sbin/nginx /usr/sbin/nginx
COPY --from=builder /etc/nginx /etc/nginx

# Create logs directory and redirection
RUN mkdir -p /var/log/nginx && \
    ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
