const DataLoader = require('dataloader');
const getRequestFieldNames = require('../../helpers/getRequestFieldNames');
const { notifyAboutAnswer } = require('../../helpers/notificationService');

module.exports = {
  Mutation: {
    createAnswer: async (_, { answer }, { dataSources, auth }, info) => {
      if (!auth.hasSignedIn || auth.getUserId() != answer.author) {
        throw new Error('unauthorized');
      }
      const question = await dataSources.Question.getOneById(answer.question);
      const createAnswerResponse = await dataSources.Answer.create(answer);
      notifyAboutAnswer(String(answer.question), question.header)
      return createAnswerResponse
    },
    acceptAnswer: async (_, { answerId }, { dataSources, auth }, info) => {
      const answer = await dataSources.Answer.getOneById(answerId);
      const question = await dataSources.Question.getOneById(
        answer.question.toString(),
      );
      if (!auth.hasSignedIn || auth.getUserId() != question.author) {
        throw new Error('unauthorized');
      }
      if (auth.getUserId() === answer.author.toString()) {
        throw new Error('questions author cannot accept own answer');
      }
      const acceptedAnswer = await dataSources.Answer.acceptAnswer(answer);
      return acceptedAnswer.isAccepted;
    },
    voteForAnswer: async (
      _,
      { answerId, userId },
      { dataSources, auth },
      info,
    ) => {
      if (!auth.hasSignedIn || auth.getUserId() != userId) {
        throw new Error('unauthorized');
      }
      const answer = await dataSources.Answer.getOneById(answerId);
      if (answer.votes.find(vote => vote.toString() === userId)) {
        throw new Error('user has already voted for this answer');
      }
      return await dataSources.Answer.addVote(answer, userId);
    },
  },
  Answer: {
    author: async (answer, __, { dataSources, dataLoaders }, info) => {
      const queryFields = getRequestFieldNames(info.fieldNodes[0]);
      let dl = dataLoaders.get(info.fieldNodes);
      if (!dl) {
        dl = new DataLoader(async ids => {
          return dataSources.User.getManyByIds(ids, queryFields);
        });
        dataLoaders.set(info.fieldNodes, dl);
      }
      const authorId = answer.author.toString();

      return dl.load(authorId);
    },
    question: async (answer, __, { dataSources, dataLoaders }, info) => {
      const queryFields = getRequestFieldNames(info.fieldNodes[0]);
      let dl = dataLoaders.get(info.fieldNodes);
      if (!dl) {
        dl = new DataLoader(async ids => {
          return dataSources.Question.getManyByIds(ids, queryFields);
        });
        dataLoaders.set(info.fieldNodes, dl);
      }
      const authorId = answer.question.toString();

      return dl.load(authorId);
    },
    votes: async (answer, __, { dataSources, dataLoaders }, info) => {
      const queryFields = getRequestFieldNames(info.fieldNodes[0]);
      let dl = dataLoaders.get(info.fieldNodes);
      if (!dl) {
        dl = new DataLoader(async ids => {
          return dataSources.User.getManyByIds(ids, queryFields);
        });
        dataLoaders.set(info.fieldNodes, dl);
      }

      return answer.votes.map(voter => dl.load(voter.toString()));
    },
  },
};
