import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './styles.scss';

export default props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = evt => {
    props.login({ variables: { email, password } });
    setEmail('');
    setPassword('');
    evt.preventDefault();
  };

  return (
    <div>
      <Form
        className="login-form"
        id="loginForm"
        onSubmit={evt => onSubmit(evt)}
      >
        <Form.Group controlId="loginFormEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={evt => setEmail(evt.target.value)}
            required
            type="email"
          />
        </Form.Group>
        <Form.Group controlId="loginFormPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={evt => setPassword(evt.target.value)}
            required
            type="password"
            placeholder=""
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Sign In
        </Button>
      </Form>
    </div>
  );
};
