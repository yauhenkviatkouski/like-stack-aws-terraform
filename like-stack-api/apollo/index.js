const { ApolloServer } = require('apollo-server-express');
const cookieParser = require('cookie-parser');
const Auth = require('./Auth');
const dataSources = require('./dataSources');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const config = require('config');

const cp = cookieParser();
const addCookies = (req, res) =>
  new Promise(resolve => {
    cp(req, res, resolve);
  });

module.exports.serverApollo = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => dataSources,
  context: async ({ req, res }) => {
    const auth = new Auth({ req, res });

    await addCookies(req, res);
    await auth.authenticate();

    return { auth, dataLoaders: new WeakMap() };
  },
  introspection: true,
  playground: true,
});
