const uniqueValidator = require('mongoose-unique-validator');
const cryptPassword = require('../../helpers/crypt');
const dbInstance = require('./dataBaseInstance');
const bcrypt = require('bcryptjs');
const getModelsBySpecificIds = require('../../helpers/getModelsBySpecificIds');

const Schema = dbInstance.Schema;

const userScheme = new Schema(
  {
    name: String,
    surname: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    nick: String,
    workPosition: String,
    experience: Number,
    mainLang: String,
  },
  { toObject: { getters: true } },
);

userScheme.plugin(uniqueValidator);

const User = dbInstance.model('User', userScheme);

class UserSource {
  async getManyByIds(usersIdArray, fields) {
    const users = await getModelsBySpecificIds(
      User,
      '_id',
      usersIdArray,
      fields,
    );
    const sortedInIdsOrder = usersIdArray.map(id =>
      users.find(u => u.id === id),
    );
    return sortedInIdsOrder;
  }

  async getOneById(id, fields) {
    return await User.findById(id, fields);
  }

  async create(user) {
    const userFromRequest = {
      ...user,
      password: cryptPassword(user.password),
    };

    const newUser = new User(userFromRequest);
    return await newUser.save();
  }

  async signIn(email, password) {
    const userFromDB = await User.findOne({ email: email });
    if (!userFromDB) {
      throw new Error('user not found');
    }
    const passwordIsValid = await bcrypt.compare(password, userFromDB.password);
    if (passwordIsValid) {
      return userFromDB;
    }
    throw new Error('invalid password');
  }
}

module.exports = UserSource;
