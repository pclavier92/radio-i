import React from 'react';

import Spinner from 'Components/spinner';
import { useAuthentication } from 'Context/authentication';

import Home from './home';
import Lobby from './lobby';

import './styles.css';

const HomeRouter = () => {
  const { loading, authenticated } = useAuthentication();
  return loading ? <Spinner /> : authenticated ? <Lobby /> : <Home />;
};

export default HomeRouter;
