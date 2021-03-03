import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { showWarningToast } from '../../utils/showToast';
import './styles.scss';

const checkPasswordsRegistration = (password, passwordConfirm) => {
  if (password === passwordConfirm) {
    return true;
  }
  showWarningToast('Passwords do not match!');
  return false;
};

export default props => {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [nick, setNick] = useState('');
  const [workPosition, setWorkPosition] = useState('');
  const [experience, setExperience] = useState('');
  const [mainLang, setMainLang] = useState('');

  const onSubmit = evt => {
    if (checkPasswordsRegistration(password, passwordConfirm)) {
      const user = {
        name,
        surname,
        email,
        password,
        nick,
        workPosition,
        mainLang,
        experience: Number(experience),
      };
      props.signUp({ variables: { user } });
    }
    evt.preventDefault();
  };

  return (
    <div>
      <Form
        className="registration-form"
        id="registrationForm"
        onSubmit={evt => onSubmit(evt)}
      >
        <Form.Group controlId="regFormName">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={evt => setName(evt.target.value)}
            required
            type="text"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="regFormSurname">
          <Form.Label>Surname</Form.Label>
          <Form.Control
            value={surname}
            onChange={evt => setSurname(evt.target.value)}
            required
            type="text"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="regFormEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            value={email}
            onChange={evt => setEmail(evt.target.value)}
            required
            type="email"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="regFormPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            value={password}
            onChange={evt => setPassword(evt.target.value)}
            required
            type="password"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="regFormPasswordConfirm">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control
            value={passwordConfirm}
            onChange={evt => setPasswordConfirm(evt.target.value)}
            required
            type="password"
            placeholder=""
          />
        </Form.Group>
        <Form.Group controlId="regFormNick">
          <Form.Label>Nick name</Form.Label>
          <Form.Control
            value={nick}
            onChange={evt => setNick(evt.target.value)}
            type="text"
            placeholder="optional"
          />
        </Form.Group>
        <Form.Group controlId="regFormWorkPosition">
          <Form.Label>Work position</Form.Label>
          <Form.Control
            value={workPosition}
            onChange={evt => setWorkPosition(evt.target.value)}
            type="text"
            placeholder="optional"
          />
        </Form.Group>
        <Form.Group controlId="regFormYearsExperience">
          <Form.Label>Years of work experience</Form.Label>
          <Form.Control
            value={experience}
            onChange={evt => setExperience(evt.target.value)}
            type="number"
            placeholder="optional"
            min="0"
          />
        </Form.Group>
        <Form.Group controlId="regFormMainLang">
          <Form.Label>Main programming language</Form.Label>
          <Form.Control
            value={mainLang}
            onChange={evt => setMainLang(evt.target.value)}
            type="text"
            placeholder="optional"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Send for registration
        </Button>
      </Form>
    </div>
  );
};
