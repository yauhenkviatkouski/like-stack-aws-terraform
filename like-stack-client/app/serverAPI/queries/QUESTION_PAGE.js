import { gql } from '@apollo/client';

export default gql`
  query question($id: ID!) {
    loggedUser @client
    question(id: $id) {
      id
      header
      body
      tags
      lastActivityDate
      author {
        name
        surname
        id
      }
      answers {
        author {
          name
          surname
          id
        }
        id
        isAccepted
        body
        lastActivityDate
        votes {
          id
        }
      }
    }
  }
`;
