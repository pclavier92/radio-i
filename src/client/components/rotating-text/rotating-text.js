import React, { Children, cloneElement } from 'react';

import './styles.css';

const RotatingText = ({ children }) => {
  const childrenWithProps = Children.map(children, (child) => {
    const childProps = { className: 'animation' };
    return cloneElement(child, childProps);
  });

  return (
    <div className="container">
      {childrenWithProps}
      <div className="animation separation" />
      {childrenWithProps}
    </div>
  );
};
export default RotatingText;
