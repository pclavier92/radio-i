import React, { useEffect, useMemo, useState, Fragment } from 'react';

import radioiApi from '../../apis/radioi-api';
import subscriptionsApi from '../../apis/subscriptions-api';
import useQuery from '../../hooks/use-query';

import NotFound from '../not-found';
import AuthenticationRequired from '../auth-required';
import { useAuthentication } from '../authentication';

import Search from './search';
import RadioPlayer from './radio-player';

import './styles.css';

const Radio = ({ radio }) => {
  const { user } = useAuthentication();
  const [listeners, setListeners] = useState(null);
  const isOwner = useMemo(() => user && user.hash === radio.hash, [user]);

  return (
    <section className="section-radio">
      <div className="row">
        <div className="row">
          {isOwner && (
            <div className="radio-title">
              <h3>
                {radio.name} by {radio.userName} | Listeners {listeners}
              </h3>
            </div>
          )}
        </div>
        <div className="col span-1-of-3">
          <RadioPlayer radio={radio} setListeners={setListeners} />
        </div>
        <div className="col span-2-of-3">{isOwner && <Search />}</div>
      </div>
    </section>
  );
};

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
          subscriptionsApi.subscribe(radioId);
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
