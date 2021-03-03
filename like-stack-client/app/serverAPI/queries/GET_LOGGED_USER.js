import { gql } from '@apollo/client';

export default gql`
  query GetLoggedUser {
    loggedUser @client
  }
`;
