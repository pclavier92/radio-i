import React from 'react';

import { AuthenticationProvider } from './Authentication';
import Header from './Header';
import NowPlaying from './components/NowPlaying';

import './css/normalize.css';
import './css/grid.css';
import './app.css';

const App = () => (
  <AuthenticationProvider>
    <Header />
    <section>
      <div className="row">
        <div className="col span-1-of-3">
          <NowPlaying />
        </div>
        <div className="col span-2-of-3" />
      </div>
    </section>
  </AuthenticationProvider>
);

export default App;
