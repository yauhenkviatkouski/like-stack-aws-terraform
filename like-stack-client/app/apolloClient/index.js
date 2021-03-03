import { ApolloClient, gql } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { cache } from './cache';

const link = createHttpLink({
  uri: 'https://like-stack-api-dock.herokuapp.com',
  credentials: 'include',
});

export const typeDefs = gql`
  extend type Query {
    isSignedInUser: String!
  }
`;

export const client = new ApolloClient({
  cache,
  link,
  typeDefs,
  resolvers: {},
  connectToDevTools: true,
});
