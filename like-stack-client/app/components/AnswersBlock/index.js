import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import Alert from 'react-bootstrap/Alert';
import { LinkContainer } from 'react-router-bootstrap';
import './styles.scss';

export default ({
  answer,
  question,
  loggedUser,
  isSolvedQuestion,
  voteForAnswer,
  acceptAnswer,
}) => {
  const votedAnswer = loggedUser
    ? answer.votes
        .map(vote => {
          return vote.id;
        })
        .includes(loggedUser.id)
    : false;
  return (
    <li className="answer-item">
      <div className="answer-handler">
        <p>Total votes: {answer.votes.length}</p>
        {loggedUser && (
          <>
            {(!votedAnswer && (
              <Button
                onClick={() =>
                  voteForAnswer({
                    variables: { answerId: answer.id, userId: loggedUser.id },
                  })
                }
              >
                Vote
              </Button>
            )) || (
              <Button variant="success" disabled>
                Vote
              </Button>
            )}
            {loggedUser.id === question.author.id &&
              !isSolvedQuestion &&
              loggedUser.id !== answer.author.id && (
                <Button
                  onClick={() =>
                    acceptAnswer({
                      variables: { answerId: answer.id },
                    })
                  }
                >
                  Accept answer
                </Button>
              )}
          </>
        )}
        {answer.isAccepted && (
          <Alert variant="success">Answer was accepted</Alert>
        )}
      </div>
      <Card className="answer-item__card">
        <Card.Body>
          <LinkContainer to={`/user/${answer.author.id}`}>
            <Card.Title>
              <Card.Link href="#">
                {answer.author.name} {answer.author.surname}:
              </Card.Link>
            </Card.Title>
          </LinkContainer>
          <Card.Text>{answer.body}</Card.Text>
        </Card.Body>
      </Card>
    </li>
  );
};
