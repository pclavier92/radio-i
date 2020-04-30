import React, { Fragment } from 'react';

import NowPlaying from './NowPlaying';
import Search from './Search';
import { useAuthentication } from './Authentication';

const Radio = () => {
  const { authenticated } = useAuthentication();
  return (
    <Fragment>
      {authenticated && (
        <section className="section-main">
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
