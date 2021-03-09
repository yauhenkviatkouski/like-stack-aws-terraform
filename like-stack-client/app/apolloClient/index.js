import { ApolloClient, gql } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { cache } from './cache';
import { config } from '../config';

const link = createHttpLink({
  uri: config.SERVER_LINK,
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
