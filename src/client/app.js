import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './main-components/header';
import Radio from './main-components/radio';
import Home from './main-components/home';
import NotFound from './main-components/not-found/not-found';
import { AuthenticationProvider as Authentication } from './main-components/authentication';

import './css/normalize.css';
import './css/grid.css';
import './app.css';

const App = () => (
  <Router>
    <Authentication>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/radio">
          <Radio />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Authentication>
  </Router>
);

export default App;
