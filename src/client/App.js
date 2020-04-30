import React from 'react';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Header from './Header';
import Radio from './Radio';
import Home from './Home';
import NotFound from './NotFound';
import { AuthenticationProvider as Authentication } from './Authentication';

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
