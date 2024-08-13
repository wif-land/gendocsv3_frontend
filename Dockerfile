FROM node:20.16-alpine3.19 AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production --omit=dev

COPY . .

RUN npm run build

FROM node:20.16-alpine3.19 AS production

WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/.env ./.env

USER node 

EXPOSE $PORT

CMD ["npm", "start"]
