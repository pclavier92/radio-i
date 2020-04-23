import React, { Fragment } from 'react';

import NowPlaying from './NowPlaying';
import Search from './Search';
import { useAuthentication } from './Authentication';

const MainSection = () => {
  const { accessToken } = useAuthentication();
  return (
    <Fragment>
      {accessToken && (
        <section>
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

export default MainSection;
