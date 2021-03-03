const QuestionSource = require('./question');
const AnswerSource = require('./answer');
const UserSource = require('./user');

module.exports = {
  Question: new QuestionSource(),
  Answer: new AnswerSource(),
  User: new UserSource(),
};
