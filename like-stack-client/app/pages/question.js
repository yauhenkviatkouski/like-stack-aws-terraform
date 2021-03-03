import React from 'react';
import { useQuery, gql } from '@apollo/client';
import QUESTION_PAGE from '../serverAPI/queries/QUESTION_PAGE';
import QuestionBlock from '../components/QuestionBlock';
import Answers from '../containers/Answers';

import Spinner from '../components/Spinner';

export default props => {
  const { loading, error, data, refetch } = useQuery(QUESTION_PAGE, {
    variables: { id: props.match.params.id },
  });

  if (loading) return <Spinner />;
  if (error) return <p>Error</p>;

  const { question, loggedUser } = data;
  return (
    <div>
      <QuestionBlock question={question} />
      <Answers
        answers={question.answers}
        question={question}
        loggedUser={loggedUser}
        refetchQuestion={refetch}
      />
    </div>
  );
};
