import React from 'react';

import Spinner from 'Components/spinner';
import { useAuthentication } from 'Context/authentication';

import Home from './home';
import Lobby from './lobby';

import './styles.css';

const HomeSwitch = () => {
  const { loading, authenticated } = useAuthentication();

  if (loading) {
    return <Spinner />;
  }

  return authenticated ? <Lobby /> : <Home />;
};

export default HomeSwitch;
