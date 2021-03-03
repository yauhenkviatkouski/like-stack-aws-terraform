import React from 'react';
import { useMutation } from '@apollo/client';
import LOGIN_USER from '../serverAPI/mutations/LOGIN_USER';
import history from '../utils/history';
import Spinner from '../components/Spinner';
import { showWarningToast, showInfoToast } from '../utils/showToast';
import { loggedUserCacheVar } from '../apolloClient/cache';

import LoginForm from '../components/LoginForm';

export default function Login() {
  const [login, { loading, error }] = useMutation(LOGIN_USER, {
    onCompleted(data) {
      const user = data.signIn;
      loggedUserCacheVar(user);
      showInfoToast('User logged In!');
      history.goBack();
    },
  });

  if (loading) return <Spinner />;
  if (error) {
    showWarningToast('Invalid email or password!');
    loggedUserCacheVar(false);
    return <LoginForm login={login} />;
  }

  return <LoginForm login={login} />;
}
