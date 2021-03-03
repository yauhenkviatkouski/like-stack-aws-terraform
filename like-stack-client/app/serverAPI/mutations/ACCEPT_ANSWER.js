import { gql } from '@apollo/client';

export default gql`
  mutation acceptAnswer($answerId: String) {
    acceptAnswer(answerId: $answerId)
  }
`;
