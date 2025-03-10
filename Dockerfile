FROM cgr.dev/chainguard/wolfi-base AS builder
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

RUN apk add --no-cache yarn nodejs

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

FROM cgr.dev/chainguard/wolfi-base AS runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache nodejs

WORKDIR /app

COPY --from=builder --chown=node:node /app/package.json ./package.json
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]