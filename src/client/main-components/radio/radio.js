import React, { useEffect, useMemo, useState, Fragment } from 'react';

import radioiApi from '../../apis/radioi-api';
import useQuery from '../../hooks/use-query';

import RadioQueue from '../../common-components/radio-queue';

import NotFound from '../not-found';
import AuthenticationRequired from '../auth-required';
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
          {isOwner && (
            <div className="radio-title">
              <h3>
                {radio.name} by {radio.userName}
              </h3>
            </div>
          )}
          <NowPlaying />
          <RadioQueue id={radio.hash} />
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

          // ---------------------------------------------------
          // Crea una nueva conexión.
          const socket = new WebSocket('ws://localhost:8888');
          const msg = {
            type: 'subscribe',
            payload: { radioId }
          };
          // Abre la conexión
          socket.addEventListener('open', event => {
            socket.send(JSON.stringify(msg));
          });

          socket.addEventListener('message', event => {
            console.log(event.data);
          });
          // ---------------------------------------------------
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
