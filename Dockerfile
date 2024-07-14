FROM node:20-alpine

RUN apk add ca-certificates openssh-client

COPY --from=danielgrant/gw:0.2.2-alpine /usr/bin/gw /usr/bin/gw

WORKDIR /app
COPY ./ /app

ENTRYPOINT ["/usr/bin/gw"]
CMD ["/app", "-vvvv", "-s", "npm ci", "-s", "npm run build"]
