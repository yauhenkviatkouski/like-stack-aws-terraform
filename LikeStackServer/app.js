const express = require('express');
const config = require('config');
const errorHandler = require('./controllers/errorHandler');
const { serverApollo } = require('./apollo');

const app = express();

const HEADERS = config.HEADERS;
const allowCrossDomain = function(req, res, next) {
  for (const headerName in HEADERS) {
    if (Object.prototype.hasOwnProperty.call(HEADERS, headerName)) {
      const headerValue = HEADERS[headerName];
      res.header(headerName, headerValue);
    }
  }
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);
app.use(express.json());
app.use(errorHandler);

serverApollo.applyMiddleware({ app, path: '/', cors: false });

module.exports = app;
