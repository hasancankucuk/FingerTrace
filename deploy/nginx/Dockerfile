dockerfile
FROM nginx:stable-alpine AS builder

# Install build dependencies
RUN apk add --no-cache \
    build-base \
    git \
    pcre-dev \
    zlib-dev \
    openssl-dev \
    libxslt-dev \
    gd-dev \
    geoip-dev \
    perl-dev \
    luajit-dev \
    linux-headers

# Clone and build the nginx-ssl-fingerprint module
RUN git clone https://github.com/phuslu/nginx-ssl-fingerprint.git /tmp/nginx-ssl-fingerprint && \
    cd /tmp/nginx-ssl-fingerprint && \
    make && \
    make install

# Build custom Nginx with the module
RUN wget http://nginx.org/download/nginx-1.24.0.tar.gz && \
    tar -zxvf nginx-1.24.0.tar.gz && \
    cd nginx-1.24.0 && \
    ./configure \
        --with-compat \
        --add-dynamic-module=/tmp/nginx-ssl-fingerprint && \
    make modules

FROM nginx:stable-alpine

# Copy the built module
COPY --from=builder /tmp/nginx-ssl-fingerprint/ngx_ssl_fingerprint_module.so /usr/lib/nginx/modules/
COPY --from=builder nginx-1.24.0/objs/ngx_ssl_fingerprint_module.so /usr/lib/nginx/modules/

# Enable the module in nginx.conf
RUN echo "load_module /usr/lib/nginx/modules/ngx_ssl_fingerprint_module.so;" > /etc/nginx/modules-enabled/ssl_fingerprint.conf