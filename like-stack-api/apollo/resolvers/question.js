const DataLoader = require('dataloader');
const getRequestFieldNames = require('../../helpers/getRequestFieldNames');
const { subscribeToQuestion } = require('../../helpers/notificationService');

module.exports = {
  Query: {
    questionsPage: async (
      _,
      { skip, limit, header },
      { dataSources },
      { fieldNodes },
    ) => {
      const selectionFieldsForQuestions = fieldNodes[0].selectionSet.selections.find(
        selection => selection.name.value === 'questions',
      );
      let questions;
      if (header) {
        questions = await await dataSources.Question.getManyByHeader(
          header,
          getRequestFieldNames(selectionFieldsForQuestions),
        );
      } else {
        questions = await dataSources.Question.getAll(
          skip,
          limit,
          getRequestFieldNames(selectionFieldsForQuestions),
        );
      }
      const count = await dataSources.Question.getCount();
      const hasMore = skip + limit < count;
      return { questions, hasMore };
    },

    question: async (_, args, context, info) => {
      return context.dataSources.Question.getOneById(
        args.id,
        getRequestFieldNames(info.fieldNodes[0]),
      );
    },
  },
  Mutation: {
    createQuestion: async (_, { question }, { dataSources, auth }, info) => {
      console.log("🚀 ~ file: question.js ~ line 43 ~ createQuestion: ~ question", question)
      const getUser = auth.getUserId()
      console.log('auth.getUserId() : ', getUser)
      if (auth.getUserId() != question.author) {
        throw new Error('unauthorized');
      }
      const newQuestion = await dataSources.Question.create(question);
      console.log("🚀 ~ file: question.js ~ line 47 ~ createQuestion: ~ newQuestion", newQuestion)
      const user = await dataSources.User.getOneById(newQuestion.author);
      const subscriberEmail = user.email;
      subscribeToQuestion((String(newQuestion._id)), subscriberEmail);

      return newQuestion;
    },
  },
  Question: {
    answers: async (question, __, { dataSources, dataLoaders }, info) => {
      const queryFields = getRequestFieldNames(info.fieldNodes[0], 'question');
      let dl = dataLoaders.get(info.fieldNodes);
      if (!dl) {
        dl = new DataLoader(async ids => {
          return dataSources.Answer.getByQuestionIds(ids, queryFields);
        });
        dataLoaders.set(info.fieldNodes, dl);
      }
      return dl.load(question.id);
    },
    author: async (question, __, { dataSources, dataLoaders }, info) => {
      const queryFields = getRequestFieldNames(info.fieldNodes[0]);
      let dl = dataLoaders.get(info.fieldNodes);
      if (!dl) {
        dl = new DataLoader(async ids => {
          return dataSources.User.getManyByIds(ids, queryFields);
        });
        dataLoaders.set(info.fieldNodes, dl);
      }
      const authorId = question.author.toString();

      return dl.load(authorId);
    },
  },
};
