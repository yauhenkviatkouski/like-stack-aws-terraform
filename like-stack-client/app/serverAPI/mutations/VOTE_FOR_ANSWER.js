import { gql } from '@apollo/client';

export default gql`
  mutation voteForAnswer($answerId: String, $userId: String) {
    voteForAnswer(answerId: $answerId, userId: $userId)
  }
`;
