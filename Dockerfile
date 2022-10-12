FROM node:16-alpine3.15

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

ENV NODE_ENV=production

