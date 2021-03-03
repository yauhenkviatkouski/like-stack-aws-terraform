import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import { useQuery, useMutation } from '@apollo/client';
import NEW_QUESTION from '../serverAPI/mutations/NEW_QUESTION';
import HOME_PAGE from '../serverAPI/queries/HOME_PAGE';
import QuestionBlock from '../components/QuestionBlock';
import QuestionForm from '../components/QuestionForm';

import Spinner from '../components/Spinner';

export default () => {
  const { loading, data, refetch, fetchMore } = useQuery(HOME_PAGE, {
    variables: { skip: 0, limit: 5 },
  });

  const [isAddingQuestion, toggleAddingQuestion] = useState(false);

  const [createQuestion] = useMutation(NEW_QUESTION, {
    onCompleted() {
      refetch();
    },
  });

  if (loading) return <Spinner />;

  const { questionsPage, loggedUser } = data;
  const { questions, hasMore } = questionsPage;

  const getMoreQuestions = () => {
    fetchMore({
      variables: {
        skip: questions.length,
        limit: 5,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          questionsPage: {
            hasMore: fetchMoreResult.questionsPage.hasMore,
            questions: [
              ...prev.questionsPage.questions,
              ...fetchMoreResult.questionsPage.questions,
            ],
          },
        };
      },
    });
  };

  return (
    <div>
      <h2>All questions:</h2>
      <div className="button-new-question">
        {loggedUser ? (
          <Button
            onClick={() => toggleAddingQuestion(true)}
            variant="secondary"
          >
            Add new
          </Button>
        ) : (
          <p>Sign In for adding question</p>
        )}
      </div>
      {questions.map(question => (
        <QuestionBlock key={question.id} question={question} isShort />
      ))}
      {hasMore && (
        <Button
          onClick={() => getMoreQuestions()}
          variant="secondary"
          size="lg"
          block
        >
          Get more questions
        </Button>
      )}
      {isAddingQuestion && (
        <QuestionForm
          loggedUser={loggedUser}
          toggleAddingQuestion={toggleAddingQuestion}
          createQuestion={createQuestion}
        />
      )}
    </div>
  );
};
