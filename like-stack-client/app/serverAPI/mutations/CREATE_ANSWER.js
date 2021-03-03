import { gql } from '@apollo/client';

export default gql`
  mutation createAnswer($answer: createAnswerInput) {
    createAnswer(answer: $answer) {
      id
    }
  }
`;
