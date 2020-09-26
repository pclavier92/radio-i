import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Spinner from './common-components/spinner';

import { AuthenticationProvider as Authentication } from './main-components/authentication';
import Header from './main-components/header';
import NotFound from './main-components/not-found/not-found';
const Radio = lazy(() =>
  import(/* webpackChunkName: "radio" */ './main-components/radio')
);
const Home = lazy(() =>
  import(/* webpackChunkName: "home" */ './main-components/home')
);

import './css/normalize.css';
import './css/grid.css';
import './app.css';

const App = () => (
  <Router>
    <Authentication>
      <Header />
      <Suspense fallback={<Spinner />}>
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
      </Suspense>
    </Authentication>
  </Router>
);

export default App;
