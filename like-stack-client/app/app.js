import { ApolloProvider } from '@apollo/client';
import '@babel/polyfill';
import 'toaster-js/default.css';
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from 'containers/App';
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import './styles.scss';
import { client } from './apolloClient';

const MOUNT_NODE = document.getElementById('app');
const renderApp = () => {
  ReactDOM.render(
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>,
    MOUNT_NODE,
  );
};

renderApp();
