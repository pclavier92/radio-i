import React, { useState, useCallback } from 'react';

import useInterval from './hooks/use-interval';
import { useHistory } from 'react-router-dom';

const NotFound = () => {
  const history = useHistory();
  const [count, setCount] = useState(10);

  const decreaseCount = useCallback(() => {
    if (count > 0) {
      setCount(count - 1);
    } else {
      history.push('/');
    }
  }, [count]);

  useInterval(decreaseCount, 1000);

  return (
    <section className="section-not-found">
      <div className="row">
        <div className="not-found-text-box">
          <h2>404 PAGE NOT FOUND</h2>
          <p>Redirecting to home in ... {count}</p>
        </div>
        <span>
          Photo by &nbsp;
          <a href="https://unsplash.com/@rexcuando?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
            Eric Nopanen
          </a>
        </span>
      </div>
    </section>
  );
};

export default NotFound;
