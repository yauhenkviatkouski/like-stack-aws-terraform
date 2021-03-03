import React from 'react';
import { useMutation } from '@apollo/client';
import { showWarningToast, showInfoToast } from '../utils/showToast';
import SIGN_UP_USER from '../serverAPI/mutations/SIGN_UP_USER';
import history from '../utils/history';
import Spinner from '../components/Spinner';

import RegisterForm from '../components/RegisterForm';

export default () => {
  const [signUp, { loading, error }] = useMutation(SIGN_UP_USER, {
    onCompleted(data) {
      const user = data.signUp;
      showInfoToast(`${user.email} was registered!, now you can sign in`);
      history.replace({ pathname: '/' });
    },
  });

  if (loading) return <Spinner />;
  if (error) {
    showWarningToast('Ups... Email already in use');
    return <RegisterForm signUp={signUp} />;
  }

  return <RegisterForm signUp={signUp} />;
};
