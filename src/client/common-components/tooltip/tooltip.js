import React from 'react';

import './styles.css';

const Tooltip = ({ children, text }) => (
  <div className="tooltip">
    {children}
    <span className="tooltiptext">{text}</span>
  </div>
);

export default Tooltip;
