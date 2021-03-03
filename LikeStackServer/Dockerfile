
FROM node:12.7-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3005

CMD node ./bin/www --bind 0.0.0.0:$PORT
