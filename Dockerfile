FROM nginx:alpine

# Copy static files to nginx public directory
COPY index.html dashboard.html detail.html /usr/share/nginx/html/
COPY css /usr/share/nginx/html/css
COPY js /usr/share/nginx/html/js
COPY assets /usr/share/nginx/html/assets
COPY manifest.json service-worker.js /usr/share/nginx/html/

# Custom nginx config for PWA
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    gzip on; \
    gzip_types text/css application/javascript application/json image/svg+xml; \
    gzip_min_length 1000; \
    \
    location /service-worker.js { \
        add_header Service-Worker-Allowed /; \
    } \
    \
    location /manifest.json { \
        add_header Content-Type application/json; \
    } \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
