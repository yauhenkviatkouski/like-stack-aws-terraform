import Loader from 'react-loader-spinner';
import React from 'react';
import { PortalModal } from '../Portal';

export default () => {
  return (
    <PortalModal>
      <Loader type="Watch" color="#00BFFF" />
    </PortalModal>
  );
};
