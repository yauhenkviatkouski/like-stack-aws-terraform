const dbInstance = require('./dataBaseInstance');
const { Types } = require('mongoose');
const Schema = dbInstance.Schema;
const getModelsBySpecificIds = require('../../helpers/getModelsBySpecificIds');

const answerScheme = new Schema(
  {
    body: String,
    lastActivityDate: Date,
    isAccepted: Boolean,
    question: { type: Schema.Types.ObjectId, ref: 'Question' },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    votes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { toObject: { getters: true } },
);

const Answer = dbInstance.model('Answer', answerScheme);

class AnswerSource {
  async getByQuestionIds(questionIdArray, fields) {
    const answers = await getModelsBySpecificIds(
      Answer,
      'question',
      questionIdArray.map(id => Types.ObjectId(id)),
      fields,
    );
    const sortedInIdsOrder = questionIdArray.map(id =>
      answers.filter(a => a.question.toString() === id),
    );
    return sortedInIdsOrder;
  }

  async getByAuthorIds(userIdArray, fields) {
    const answers = await getModelsBySpecificIds(
      Answer,
      'author',
      userIdArray.map(id => Types.ObjectId(id)),
      fields,
    );
    const sortedInIdsOrder = userIdArray.map(id =>
      answers.filter(a => a.author.toString() === id),
    );
    return sortedInIdsOrder;
  }

  async getOneById(id, fields) {
    return await Answer.findById(id, fields);
  }

  async create(answer) {
    const newAnswer = new Answer({
      ...answer,
      lastActivityDate: new Date(),
    });
    return await newAnswer.save();
  }

  async acceptAnswer(answer) {
    answer.isAccepted = true;
    return answer.save();
  }

  async addVote(answer, userId) {
    answer.votes.push(userId);
    const updatedAnswer = await answer.save();
    return updatedAnswer.votes;
  }
}

module.exports = AnswerSource;
