FROM node:18-alpine

RUN \
apk update && \
apk upgrade && \
apk add --no-cache git ca-certificates wget openssh git && \
apk add dumb-init

WORKDIR /backend-swordhealth
RUN chown -R node /backend-swordhealth

USER node

COPY --chown=node:node ["package.json", "package-lock.json", "./"]

RUN npm ci

COPY --chown=node:node . .

CMD ["dumb-init", "node", "src/app.js"]