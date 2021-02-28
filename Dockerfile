FROM node:lts-alpine3.12

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . ./
EXPOSE 3008
CMD ["node", "server.js"]