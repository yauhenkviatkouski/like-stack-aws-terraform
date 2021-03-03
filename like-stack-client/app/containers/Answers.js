import React from 'react';
import { useMutation } from '@apollo/client';
import ACCEPT_ANSWER from '../serverAPI/mutations/ACCEPT_ANSWER';
import CREATE_ANSWER from '../serverAPI/mutations/CREATE_ANSWER';
import VOTE_FOR_ANSWER from '../serverAPI/mutations/VOTE_FOR_ANSWER';
import AnswerForm from '../components/AnswerForm';
import AnswerBlock from '../components/AnswersBlock';

export default ({ question, answers, loggedUser, refetchQuestion }) => {
  const isSolvedQuestion = question.answers.find(answer => answer.isAccepted);
  const [createAnswer] = useMutation(CREATE_ANSWER, {
    onCompleted() {
      refetchQuestion();
    },
  });
  const [voteForAnswer] = useMutation(VOTE_FOR_ANSWER, {
    onCompleted() {
      refetchQuestion();
    },
  });
  const [acceptAnswer] = useMutation(ACCEPT_ANSWER, {
    onCompleted() {
      refetchQuestion();
    },
  });
  return (
    <div>
      {(answers.length && (
        <ul className="answers-list">
          {answers.map(answer => (
            <AnswerBlock
              answer={answer}
              question={question}
              key={answer.id}
              isSolvedQuestion={isSolvedQuestion}
              loggedUser={loggedUser}
              voteForAnswer={voteForAnswer}
              acceptAnswer={acceptAnswer}
            />
          ))}
        </ul>
      )) || <p>Until no one answered this question, you can be the first.</p>}
      {!isSolvedQuestion && (
        <AnswerForm
          loggedUser={loggedUser}
          question={question}
          createAnswer={createAnswer}
        />
      )}
    </div>
  );
};
