
FROM node:12.7

RUN mkdir /app-client
WORKDIR /app-client

COPY package*.json ./

RUN npm i -g nodemon

RUN npm install

COPY . .

EXPOSE 3000

CMD npm start --bind 0.0.0.0:$PORT
