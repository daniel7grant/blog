FROM node:20-alpine AS builder

WORKDIR /app

COPY ./ /app

RUN npm ci && \
    npm run build

FROM nginx:1.27-alpine

COPY --from=builder /app/dist /srv/http
COPY ./nginx.conf /etc/nginx/nginx.conf
