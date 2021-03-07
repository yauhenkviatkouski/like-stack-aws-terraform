const bcrypt = require('bcryptjs');
const config = require('config');

const cryptPassword = userPassword => {
  const SALT_ROUNDS = config.bcrypt.SALT_ROUNDS;
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const passwordHash = bcrypt.hashSync(userPassword, salt);
  return passwordHash;
};

module.exports = cryptPassword;
