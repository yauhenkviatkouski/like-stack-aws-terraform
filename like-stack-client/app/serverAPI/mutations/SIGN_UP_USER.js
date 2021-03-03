import { gql } from '@apollo/client';

export default gql`
  mutation signUpMutation($user: createUserInput) {
    signUp(user: $user) {
      email
    }
  }
`;
