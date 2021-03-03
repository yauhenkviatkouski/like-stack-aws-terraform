import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Switch, Route } from 'react-router-dom';
import { showInfoToast } from '../../utils/showToast';
import IS_SIGNED_IN_USER from '../../serverAPI/queries/IS_SIGNED_IN_USER';
import SIGN_OUT from '../../serverAPI/mutations/SIGN_OUT';
import RegistrationPage from '../../pages/register';
import LoginPage from '../../pages/login';
import Spinner from '../../components/Spinner';
import NavBar from '../../components/NavBar';
import HomeQuestionsPage from '../../pages/home';
import QuestionPage from '../../pages/question';
import { Footer } from '../../components/footer';
import UserPage from '../../pages/user';
import { loggedUserCacheVar } from '../../apolloClient/cache';

export default () => {
  const { loading } = useQuery(IS_SIGNED_IN_USER, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      if (data.isSignedInUser) {
        loggedUserCacheVar(data.isSignedInUser);
      }
    },
  });

  const [signOut] = useMutation(SIGN_OUT, {
    onCompleted() {
      loggedUserCacheVar(null);
      showInfoToast('Logged out!');
    },
  });
  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <NavBar signOut={signOut} />
      <main>
        <Switch>
          <Route path="/register" component={RegistrationPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/question/:id" component={QuestionPage} />
          <Route path="/user/:id" component={UserPage} />
          <Route path="/" component={HomeQuestionsPage} />
        </Switch>
      </main>
      <Footer />
    </>
  );
};
