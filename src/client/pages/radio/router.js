import React, { useEffect, useState } from 'react';

import radioiApi from 'Apis/radioi-api';
import Spinner from 'Components/spinner';
import AuthenticationRequired from 'Components/auth-required';
import { useAuthentication } from 'Context/authentication';
import useQuery from 'Hooks/use-query';

import NotFound from '../not-found';

import Radio from './radio';

const RadioRouter = () => {
  const [radio, setRadio] = useState(null);
  const [loadingRadio, setLoadingRadio] = useState(true);
  const { loading: loadingAuth, authenticated } = useAuthentication();

  const q = useQuery();
  const radioId = q.get('id');

  const isNotAuthenticated = !authenticated;
  const isLoading = loadingAuth || (authenticated && loadingRadio);
  const isNotFound = !radioId || (!loading && !radio);

  useEffect(() => {
    if (radioId && authenticated) {
      (async () => {
        try {
          const { data } = await radioiApi.getRadio(radioId);
          setRadio(data);
          setLoadingRadio(false);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setRadio(null);
            setLoadingRadio(false);
          } else {
            console.error(error);
          }
        }
      })();
    }
  }, [radioId, authenticated]);

  if (isNotFound) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (isNotAuthenticated) {
    <AuthenticationRequired />;
  }

  return <Radio radio={radio} />;
};

export default RadioRouter;
