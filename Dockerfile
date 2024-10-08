FROM node:20.10-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
