import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import ListGroup from 'react-bootstrap/ListGroup';
import { LinkContainer } from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import GET_QUESTION_BY_HEADER from '../serverAPI/queries/GET_QUESTION_BY_HEADER';
import { PortalModal } from '../components/Portal';

export default () => {
  const [foundVariants, setFoundVariants] = useState(null);
  const [inputSearch, setInputSearch] = useState('');
  const [getQuestions] = useLazyQuery(GET_QUESTION_BY_HEADER, {
    onCompleted(data) {
      setFoundVariants(data.questionsPage.questions);
    },
  });

  const onSubmit = evt => {
    evt.preventDefault();
    getQuestions({ variables: { header: inputSearch } });
    setInputSearch('');
  };

  return (
    <>
      <Form inline onSubmit={evt => onSubmit(evt)}>
        <FormControl
          value={inputSearch}
          onChange={evt => setInputSearch(evt.target.value)}
          type="text"
          placeholder="Search question"
          className="mr-sm-2"
        />
        <Button type="submit" variant="outline-info">
          Search
        </Button>
      </Form>
      {foundVariants && (
        <PortalModal>
          <ListGroup variant="flush" className="search-variants">
            {foundVariants.map(question => (
              <LinkContainer
                key={question.id}
                onClick={() => this.onClickSearch(question.id)}
                to={`/question/${question.id}`}
              >
                <ListGroup.Item action>{question.header}</ListGroup.Item>
              </LinkContainer>
            ))}
            <Button
              onClick={() => setFoundVariants(null)}
              size="sm"
              variant="dark"
            >
              Cancel
            </Button>
          </ListGroup>
        </PortalModal>
      )}
    </>
  );
};
