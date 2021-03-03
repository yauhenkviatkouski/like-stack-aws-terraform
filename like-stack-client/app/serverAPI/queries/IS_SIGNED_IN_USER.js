import { gql } from '@apollo/client';

export default gql`
  query isSignedInUser {
    isSignedInUser {
      id
      name
    }
    isLoading @client
  }
`;
