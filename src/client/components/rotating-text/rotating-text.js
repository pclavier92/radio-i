import React from 'react';

import './styles.css';

const setAnimation = () => ({});

const RotatingText = ({ text, width, duration }) => {
  const containerProps = { style: { width } };
  const bannerProps = { style: { ...setAnimation() } };

  return (
    <div className="container" {...containerProps}>
      <span className="banner" {...bannerProps}>
        {text}
&nbsp;
{text}
      </span>
    </div>
  );
};

export default RotatingText;
