const mongoose = require('mongoose');
const config = require('config');

const MONGO_URL = config.DATABASE.MONGO_URL;

mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

module.exports = mongoose;
