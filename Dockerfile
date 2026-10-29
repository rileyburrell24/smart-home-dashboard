FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache docker-cli docker-cli-compose unzip

COPY package*.json ./
RUN npm install --omit=dev

COPY server.js ./
COPY public ./public

ENV NODE_ENV=production
ENV PORT=8088

EXPOSE 8088
CMD ["npm", "start"]
