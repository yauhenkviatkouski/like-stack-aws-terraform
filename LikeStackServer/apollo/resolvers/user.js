const DataLoader = require('dataloader');
const getRequestFieldNames = require('../../helpers/getRequestFieldNames');

module.exports = {
  Query: {
    user: async (_, args, { dataSources }, info) => {
      return dataSources.User.getOneById(
        args.id,
        getRequestFieldNames(info.fieldNodes[0]),
      );
    },
    isSignedInUser: async (_, __, { dataSources, auth }, info) => {
      if (auth.hasSignedIn) {
        return dataSources.User.getOneById(
          auth.getUserId(),
          getRequestFieldNames(info.fieldNodes[0]),
        );
      }
      return null;
    },
  },

  Mutation: {
    signUp: async (_, { user }, { dataSources }, info) => {
      return await dataSources.User.create(user);
    },
    signIn: async (_, { email, password }, { dataSources, auth }, info) => {
      const user = await dataSources.User.signIn(email, password);
      auth.signInWithJWT(user);
      return user;
    },
    async signOut(_, __, { auth }) {
      console.log('LOGGED OUT');
      await auth.signOut();
      return true;
    },
  },

  User: {
    answers: async (user, __, { dataSources, dataLoaders }, info) => {
      const queryFields = getRequestFieldNames(info.fieldNodes[0], 'author');
      let dl = dataLoaders.get(info.fieldNodes);
      if (!dl) {
        dl = new DataLoader(async ids => {
          return dataSources.Answer.getByAuthorIds(ids, queryFields);
        });
        dataLoaders.set(info.fieldNodes, dl);
      }
      return dl.load(user.id);
    },
    questions: async (user, __, { dataSources, dataLoaders }, info) => {
      const queryFields = getRequestFieldNames(info.fieldNodes[0], 'author');
      let dl = dataLoaders.get(info.fieldNodes);
      if (!dl) {
        dl = new DataLoader(async ids => {
          return dataSources.Question.getByAuthorIds(ids, queryFields);
        });
        dataLoaders.set(info.fieldNodes, dl);
      }
      return dl.load(user.id);
    },
  },
};
