import { gql } from '@apollo/client';

export default gql`
  query getUser($id: ID!) {
    user(id: $id) {
      name
      surname
      email
      nick
      workPosition
      experience
      mainLang
      answers {
        votes {
          id
        }
        isAccepted
      }
    }
  }
`;
