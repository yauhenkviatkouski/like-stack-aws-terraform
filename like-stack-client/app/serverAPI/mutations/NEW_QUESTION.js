import { gql } from '@apollo/client';

export default gql`
  mutation CreateQuestion($question: createQuestionInput) {
    createQuestion(question: $question) {
      id
    }
  }
`;
