const logger = require('../helpers/logger');

const errorHandler = (err, req, res, next) => {
  err.status = err.status || 500;
  logger.error(`status: ${err.status}, error stack: ${err.stack}`);
  res.status(err.status);
  res.send(err);
};

module.exports = errorHandler;
