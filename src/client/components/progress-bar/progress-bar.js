import React from 'react';

import './styles.css';

const ProgressBar = ({ completed }) => (
  <div className="progress-bar clearfix">
    <div className="completed-bar" style={{ width: `${completed}%` }} />
    <div className="empty-bar" style={{ width: `${100 - completed}%` }} />
  </div>
);

export default ProgressBar;
