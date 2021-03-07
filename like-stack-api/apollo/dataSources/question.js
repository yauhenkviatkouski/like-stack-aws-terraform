const dbInstance = require('./dataBaseInstance');
const Schema = dbInstance.Schema;
const getModelsBySpecificIds = require('../../helpers/getModelsBySpecificIds');

const questionSchema = new Schema(
  {
    header: String,
    body: String,
    tags: [String],
    lastActivityDate: Date,
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { toObject: { getters: true } },
);

const Question = dbInstance.model('Question', questionSchema);

class QuestionSource {
  async getAll(skip, limit, fields) {
    const questions = await Question.find({}, fields, {
      sort: { lastActivityDate: -1 },
      skip: skip,
      limit: limit,
    });
    return questions;
  }

  async getCount() {
    return await Question.countDocuments();
  }

  async getOneById(id, fields) {
    return await Question.findById(id, fields);
  }

  async getManyByIds(questionsIdArray, fields) {
    const questions = await getModelsBySpecificIds(
      Question,
      '_id',
      questionsIdArray,
      fields,
    );
    const sortedInIdsOrder = questionsIdArray.map(id =>
      questions.find(q => q.id === id),
    );
    return sortedInIdsOrder;
  }

  async getByAuthorIds(userIdArray, fields) {
    const questions = await getModelsBySpecificIds(
      Question,
      'author',
      userIdArray,
      fields,
    );
    const sortedInIdsOrder = userIdArray.map(id =>
      questions.filter(q => q.author.toString() === id),
    );
    return sortedInIdsOrder;
  }

  async getManyByHeader(header, fields) {
    const questions = await Question.find(
      { header: { $regex: header } },
      fields,
    );
    return questions;
  }

  async create(question) {
    const newQuestion = new Question({
      ...question,
      lastActivityDate: new Date(),
    });
    return await newQuestion.save();
  }
}

module.exports = QuestionSource;
