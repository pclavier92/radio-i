import React, { Fragment } from 'react';

import NowPlaying from './now-playing';
import Search from './search';
import { useAuthentication } from '../authentication';

import './styles.css';

const Radio = () => {
  const { authenticated } = useAuthentication();
  return (
    <Fragment>
      {authenticated && (
        <section className="section-radio">
          <div className="row">
            <div className="col span-1-of-3">
              <NowPlaying />
            </div>
            <div className="col span-2-of-3">
              <Search />
            </div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

export default Radio;
