import { gql } from '@apollo/client';

export default gql`
  query getQsnByHdr($header: String) {
    questionsPage(header: $header) {
      questions {
        header
        id
      }
    }
  }
`;
