FROM node:20-alpine

COPY --from=danielgrant/gw:0.4.0 /usr/bin/gw /usr/bin/gw

ENTRYPOINT ["/usr/bin/gw"]
CMD ["/app", "-v", "-s", "/usr/local/bin/npm ci", "-s", "/usr/local/bin/npm run build"]