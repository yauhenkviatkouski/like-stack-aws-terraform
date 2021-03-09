
FROM node:12.7

RUN mkdir /app
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3005

CMD npm start --bind 0.0.0.0:$PORT
