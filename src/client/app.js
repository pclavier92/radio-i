import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Spinner from 'Components/spinner';
import Header from 'Components/header';
import NotFound from 'Pages/not-found/not-found';
const Radio = lazy(() => import(/* webpackChunkName: "radio" */ 'Pages/radio'));
const Home = lazy(() => import(/* webpackChunkName: "home" */ 'Pages/home'));
import { AuthenticationProvider } from 'Context/authentication';

import './css/normalize.css';
import './css/grid.css';
import './app.css';

const App = () => (
  <Router>
    <AuthenticationProvider>
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
    </AuthenticationProvider>
  </Router>
);

export default App;
