FROM nginx:stable-alpine

# Install required packages
RUN apk add --no-cache \
    build-base \
    git \
    pcre-dev \
    zlib-dev \
    openssl-dev \
    libxslt-dev \
    gd-dev \
    geoip-dev \
    perl-dev

# Download and build nginx with ssl_fingerprint module
RUN cd /tmp && \
    wget http://nginx.org/download/nginx-1.24.0.tar.gz && \
    tar -zxvf nginx-1.24.0.tar.gz && \
    git clone https://github.com/phuslu/nginx-ssl-fingerprint.git && \
    cd nginx-1.24.0 && \
    ./configure \
        --with-compat \
        --add-dynamic-module=../nginx-ssl-fingerprint \
        --with-http_ssl_module \
        --with-stream_ssl_module \
        --prefix=/usr/local/nginx-with-ja3 && \
    make modules && \
    cp objs/ngx_ssl_fingerprint_module.so /usr/lib/nginx/modules/

# Enable the module
RUN echo "load_module /usr/lib/nginx/modules/ngx_ssl_fingerprint_module.so;" > /etc/nginx/modules-enabled/ssl_fingerprint.conf