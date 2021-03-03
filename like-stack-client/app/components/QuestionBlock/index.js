import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { LinkContainer } from 'react-router-bootstrap';
import './styles.scss';
import PropTypes from 'prop-types';

const QuestionBlock = props => {
  const { question, isShort } = props;
  const isSolved = question.answers.find(answer => answer.isAccepted);
  const tagList = question.tags.map(tag => (
    <li className="question-card__tag" key={`${question.id}_${tag}`}>
      {tag}
    </li>
  ));
  const lastActivity = new Date(
    Number(question.lastActivityDate),
  ).toLocaleDateString('ru', { hour: 'numeric', minute: 'numeric' });
  const answersNumber = question.answers.length;
  return (
    <Card
      className={
        isShort ? 'question-card question-card_short' : 'question-card'
      }
      border="light"
    >
      <Card.Header>
        <LinkContainer to={`/user/${question.author.id}`}>
          <Card.Title>
            Author:
            <Card.Link href="">
              {' '}
              {question.author.name} {question.author.surname}
            </Card.Link>
          </Card.Title>
        </LinkContainer>

        <br />
        {isSolved && (
          <Button variant="success" disabled>
            Solved
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        <Card.Title>{question.header}</Card.Title>
        <Card.Text>{question.body}</Card.Text>
        {isShort && (
          <LinkContainer to={`/question/${question.id}`}>
            <Button variant="secondary">details...</Button>
          </LinkContainer>
        )}
        {isSolved && isShort && (
          <Button variant="success" disabled>
            Solved!
          </Button>
        )}
        <p className="question-card__last-activity">
          Last activity: {lastActivity}
        </p>
      </Card.Body>
      <Card.Footer>
        <ul className="question-card__tags">{tagList}</ul>

        <Card.Text>Answers: {answersNumber}</Card.Text>
      </Card.Footer>
    </Card>
  );
};

QuestionBlock.propTypes = {
  question: PropTypes.object,
  isShort: PropTypes.bool,
};

export default QuestionBlock;
