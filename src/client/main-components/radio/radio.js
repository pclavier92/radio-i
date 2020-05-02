import React, { useEffect, useMemo, useState } from 'react';

import radioiApi from '../../apis/radioi-api';
import useQuery from '../../hooks/use-query';

import NotFound from '../not-found';
import { useAuthentication } from '../authentication';

import NowPlaying from './now-playing';
import Search from './search';

import './styles.css';

const Radio = ({ radio }) => {
  const { user } = useAuthentication();
  const isOwner = useMemo(() => user && user.hash === radio.hash, [user]);

  return (
    <section className="section-radio">
      <div className="row">
        <div className="col span-1-of-3">
          <div className="radio-title">
            <h3>{radio ? `${radio.name} by ${radio.userName}` : null}</h3>
          </div>
          <NowPlaying />
        </div>
        <div className="col span-2-of-3">{isOwner && <Search />}</div>
      </div>
    </section>
  );
};

const AuthenticationRequired = () => (
  <section className="section-auth-required background-img">
    <div className="row">
      <div className="auth-required-text-box">
        <h2>Authentication is required to access this content</h2>
      </div>
      <div className="login-required-text-box">
        <h1>Please login with spotify</h1>
      </div>
    </div>
  </section>
);

const RadioRouter = () => {
  const [radio, setRadio] = useState(null);
  const { authenticated } = useAuthentication();
  const q = useQuery();
  const radioId = useMemo(() => q.get('id'), []);

  useEffect(() => {
    if (authenticated && radioId) {
      (async () => {
        try {
          const { data } = await radioiApi.getRadio(radioId);
          setRadio(data);
        } catch (error) {
          if (error.response.status === 404) {
            console.log('Radio doesnt exists');
          }
        }
      })();
    }
  }, [authenticated]);

  if (!radioId) {
    return <NotFound />;
  } else if (authenticated) {
    if (radio) {
      return <Radio radio={radio} />;
    } else {
      return <NotFound />;
    }
  } else {
    return <AuthenticationRequired />;
  }
};

export default RadioRouter;
