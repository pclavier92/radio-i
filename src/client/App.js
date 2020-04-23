import React from 'react';

import Header from './Header';
import MainSection from './MainSection';
import { AuthenticationProvider as Authentication } from './Authentication';

import './css/normalize.css';
import './css/grid.css';
import './app.css';

const App = () => (
  <Authentication>
    <Header />
    <MainSection />
  </Authentication>
);

export default App;
