const bunyan = require('bunyan');
const logger = bunyan.createLogger({
  name: 'errorHandler',
  stream: process.stdout,
  level: 'info',
});

module.exports = logger;
