import { Portal } from 'react-portal';
import React from 'react';
import './styles.scss';
import PropTypes from 'prop-types';

export const PortalModal = ({ children }) => (
  <Portal>
    <div className="portal">{children}</div>
  </Portal>
);

PortalModal.propTypes = {
  children: PropTypes.node,
};
