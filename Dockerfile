FROM node:24-alpine

WORKDIR /app/server

COPY server/package*.json ./

RUN npm install

COPY server/src ./src
COPY client ../client

EXPOSE 3000

CMD ["node", "src/server.js"]
