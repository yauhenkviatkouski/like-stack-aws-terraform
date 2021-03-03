import React from 'react';
import Card from 'react-bootstrap/Card';
import { ratingCalculation } from '../../utils/ratingCalculation';

export default ({ user }) => {
  const answerDetails = { acceptedAnswers: 0, votesForAnswers: 0 };
  user.answers.forEach(answer => {
    answerDetails.votesForAnswers += answer.votes.length;
    if (answer.isAccepted) {
      answerDetails.acceptedAnswers += 1;
    }
  });

  return (
    <>
      <Card className="user-information" bg="light">
        <Card.Body>
          <Card.Title>{`${user.name} ${user.surname}`}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {user.nick && `< ${user.nick} >`}
          </Card.Subtitle>
          <Card.Text>
            Work position: <strong>{user.workPosition || '...'}</strong>
            <br />
            Experience (years): <strong>{`${user.experience || '...'}`}</strong>
            <br />
            Main programming language: <strong>{user.mainLang || '...'}</strong>
            <br />
            questions answered: <strong>{user.answers.length}</strong>
            <br />
            votes for answers: <strong>{answerDetails.votesForAnswers}</strong>
            <br />
            issues resolved: <strong>{answerDetails.acceptedAnswers}</strong>
            <br />
            <strong>
              Total user rating:{' '}
              {ratingCalculation(
                answerDetails.votesForAnswers,
                answerDetails.acceptedAnswers,
                user.answers.length,
              )}
            </strong>
            <br />
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
};
