FROM node:20-alpine

RUN apk add ca-certificates openssh-client && \
    printf "[safe]\ndirectory = /app" >> /root/.gitconfig

COPY --from=danielgrant/gw:0.2.2-alpine /usr/bin/gw /usr/bin/gw

ENTRYPOINT ["/usr/bin/gw"]
CMD ["/app", "-v", "-s", "npm ci", "-s", "npm run build"]
