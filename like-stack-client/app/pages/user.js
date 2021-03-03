import { useQuery } from '@apollo/client';
import React from 'react';
import USER from '../serverAPI/queries/USER';
import UserInfoBlock from '../components/UserInfoBlock';
import Spinner from '../components/Spinner';

export default props => {
  const { loading, data } = useQuery(USER, {
    variables: { id: props.match.params.id },
  });
  if (loading) return <Spinner />;
  const { user } = data;

  return <UserInfoBlock user={user} />;
};
