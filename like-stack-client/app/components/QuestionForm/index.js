import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { PortalModal } from '../Portal';
import './styles.scss';

export default ({ loggedUser, createQuestion, toggleAddingQuestion }) => {
  const [header, setHeader] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');

  const onSubmit = evt => {
    evt.persist();
    const tagsFixed = tags.replace(/\s\s+/g, ' ');
    const uniqueTags = new Set(tagsFixed.split(' '));
    const dataForSend = {
      header,
      body,
      tags: [...uniqueTags],
      author: loggedUser.id,
    };
    createQuestion({ variables: { question: dataForSend } });
    toggleAddingQuestion(false);
    evt.preventDefault();
  };

  return (
    <PortalModal>
      <Form
        className="question-form"
        id="questionForm"
        onSubmit={evt => onSubmit(evt)}
      >
        <Form.Group controlId="questionFormHeader">
          <Form.Label>Header of new question</Form.Label>
          <Form.Control
            value={header}
            onChange={evt => setHeader(evt.target.value)}
            required
            type="text"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="questionFormBody">
          <Form.Label>Question</Form.Label>
          <Form.Control
            value={body}
            onChange={evt => setBody(evt.target.value)}
            required
            as="textarea"
            rows="5"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="questionFormTags">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            value={tags}
            onChange={evt => setTags(evt.target.value)}
            required
            type="text"
            placeholder="space-separated"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send question
        </Button>
        <Button variant="secondary" onClick={() => toggleAddingQuestion(false)}>
          Cancel
        </Button>
      </Form>
    </PortalModal>
  );
};
