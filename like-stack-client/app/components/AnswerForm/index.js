import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default props => {
  const isSolvedQuestion = props.question.answers.find(
    answer => answer.isAccepted,
  );
  const [answerText, setAnswerText] = useState('');

  const onSubmit = evt => {
    const dataForSend = {
      body: answerText,
      author: props.loggedUser.id,
      question: props.question.id,
    };
    props.createAnswer({ variables: { answer: dataForSend } });
    evt.preventDefault();
    setAnswerText('');
  };

  if (isSolvedQuestion) {
    return <p>The question was resolved, discussion closed</p>;
  }
  if (!props.loggedUser) {
    return <p>Sign in for sending answer</p>;
  }
  return (
    <Form id="questionForm" onSubmit={evt => onSubmit(evt)}>
      <Form.Group controlId="answerFormBody">
        <Form.Label>Your answer:</Form.Label>
        <Form.Control
          value={answerText}
          onChange={evt => setAnswerText(evt.target.value)}
          required
          as="textarea"
          rows="5"
          placeholder=""
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Send
      </Button>
    </Form>
  );
};
