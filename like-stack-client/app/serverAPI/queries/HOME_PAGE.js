import { gql } from '@apollo/client';

export default gql`
  query questionsPage($skip: Int, $limit: Int) {
    loggedUser @client
    questionsPage(skip: $skip, limit: $limit) {
      questions {
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
          id
        }
      }
      hasMore
    }
  }
`;
