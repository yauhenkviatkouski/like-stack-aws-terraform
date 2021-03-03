import { gql } from '@apollo/client';

export default gql`
  mutation signInMutation($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      id
      name
    }
  }
`;
